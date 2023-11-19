'use strict';

var should = require('chai').should();

var aipgcore = require('../..');
var MerkleBlock = aipgcore.MerkleBlock;
var BufferReader = aipgcore.encoding.BufferReader;
var BufferWriter = aipgcore.encoding.BufferWriter;
var Transaction = aipgcore.Transaction;
var data = require('../data/merkleblocks.js');
var transactionVector = require('../data/tx_creation');


describe('MerkleBlock', function() {
  var blockhex  = data.HEX[0];
  var blockbuf  = new Buffer(blockhex,'hex');
  var blockJSON = JSON.stringify(data.JSON[0]);
  var blockObject = JSON.parse(JSON.stringify(data.JSON[0]));

  describe('#constructor', function() {
    it('should make a new merkleblock from buffer', function() {
      var b = MerkleBlock(blockbuf);
      b.toBuffer().toString('hex').should.equal(blockhex);
    });

    it('should make a new merkleblock from object', function() {
      var b = MerkleBlock(blockObject);
      b.toObject().should.deep.equal(blockObject);
    });

    it('should make a new merkleblock from JSON', function() {
      var b = MerkleBlock(JSON.parse(blockJSON));
      JSON.stringify(b).should.equal(blockJSON);
    });

    it('should not make an empty block', function() {
      (function() {
        return new MerkleBlock();
      }).should.throw('Unrecognized argument for MerkleBlock');
    });
  });

  describe('#fromObject', function() {

    it('should set these known values', function() {
      var block = MerkleBlock.fromObject(JSON.parse(blockJSON));
      should.exist(block.header);
      should.exist(block.numTransactions);
      should.exist(block.hashes);
      should.exist(block.flags);
    });

    it('should set these known values', function() {
      var block = MerkleBlock(JSON.parse(blockJSON));
      should.exist(block.header);
      should.exist(block.numTransactions);
      should.exist(block.hashes);
      should.exist(block.flags);
    });

    it('accepts an object as argument', function() {
      var block = MerkleBlock(blockbuf);
      MerkleBlock.fromObject(block.toObject()).should.exist();
    });

  });

  describe('#toJSON', function() {

    it('should recover these known values', function() {
      var block = new MerkleBlock(JSON.parse(blockJSON));
      var b = JSON.parse(JSON.stringify(block));
      should.exist(block.header);
      should.exist(block.numTransactions);
      should.exist(block.hashes);
      should.exist(block.flags);
      should.exist(b.header);
      should.exist(b.numTransactions);
      should.exist(b.hashes);
      should.exist(b.flags);
    });

  });

  describe('#fromBuffer', function() {

    it('should make a block from this known buffer', function() {
      var block = MerkleBlock.fromBuffer(blockbuf);
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#fromBufferReader', function() {

    it('should make a block from this known buffer', function() {
      var block = MerkleBlock.fromBufferReader(BufferReader(blockbuf));
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#toBuffer', function() {

    it('should recover a block from this known buffer', function() {
      var block = MerkleBlock.fromBuffer(blockbuf);
      block.toBuffer().toString('hex').should.equal(blockhex);
    });

  });

  describe('#toBufferWriter', function() {

    it('should recover a block from this known buffer', function() {
      var block = MerkleBlock.fromBuffer(blockbuf);
      block.toBufferWriter().concat().toString('hex').should.equal(blockhex);
    });

    it('doesn\'t create a bufferWriter if one provided', function() {
      var writer = new BufferWriter();
      var block = MerkleBlock.fromBuffer(blockbuf);
      block.toBufferWriter(writer).should.equal(writer);
    });

  });


  describe('#validMerkleTree', function() {

    it('should validate good merkleblocks', function() {
      data.JSON.forEach(function(data) {
        var b = MerkleBlock(data);
        b.validMerkleTree().should.equal(true);
      });
    });

    it('should not validate merkleblocks with too many hashes', function() {
      var b = MerkleBlock(data.JSON[0]);
      // Add too many hashes
      var i = 0;
      while(i <= b.numTransactions) {
        b.hashes.push('bad' + i++);
      }
      b.validMerkleTree().should.equal(false);
    });

    it('should not validate merkleblocks with too few bit flags', function() {
      var b = MerkleBlock(JSON.parse(blockJSON));
      b.flags.pop();
      b.validMerkleTree().should.equal(false);
    });

  });

  describe('#filterdTxsHash', function() {

    it('should validate good merkleblocks', function() {
      var hashOfFilteredTx = 'ef580a0eb8f79711249f0fb1df5fffa7297fd85f2643a5c06f28a874af03e1c3';
      var b = MerkleBlock(data.JSON[3]);
      b.filterdTxsHash()[0].should.equal(hashOfFilteredTx);
    });

    it('should fail with merkleblocks with too many hashes', function() {
      var b = MerkleBlock(data.JSON[0]);
      // Add too many hashes
      var i = 0;
      while(i <= b.numTransactions) {
        b.hashes.push('bad' + i++);
      }
      (function() {
        b.filterdTxsHash();
      }).should.throw('This MerkleBlock contain an invalid Merkle Tree');
    });

    it('should fail with merkleblocks with too few bit flags', function() {
      var b = MerkleBlock(JSON.parse(blockJSON));
      b.flags.pop();
      (function() {
        b.filterdTxsHash();
      }).should.throw('This MerkleBlock contain an invalid Merkle Tree');
    });

  });

  describe('#hasTransaction', function() {

    it('should find transactions via hash string', function() {
      var jsonData = data.JSON[0];
      var txId = new Buffer(jsonData.hashes[1],'hex').toString('hex');
      var b = MerkleBlock(jsonData);
      b.hasTransaction(txId).should.equal(true);
      b.hasTransaction(txId + 'abcd').should.equal(false);
    });

    it('should find transactions via Transaction object', function() {
      var jsonData = data.JSON[0];
      var txBuf = new Buffer(data.TXHEX[0][0],'hex');
      var tx = new Transaction().fromBuffer(txBuf);
      var b = MerkleBlock(jsonData);
      b.hasTransaction(tx).should.equal(true);
    });

    it('should not find non-existant Transaction object', function() {
      // Reuse another transaction already in data/ dir
      var serialized = transactionVector[0][7];
      var tx = new Transaction().fromBuffer(new Buffer(serialized, 'hex'));
      var b = MerkleBlock(data.JSON[0]);
      b.hasTransaction(tx).should.equal(false);
    });

    it('should not match with merkle nodes', function() {
      var b = MerkleBlock(data.JSON[0]);

      var hashData = [
        ['86256652b60bafa12dc31acea84e2c0cbe612dd5e9a181a0a8be2bea047fd76f', false],
        ['d852d4e912975bffccf5b1a617e4c3ac1e7b91afc244f7984e95013bdc867367', true],
        ['f63691f75198cdd26ac81a0355a397763adda0bd5c1f7204712b9648aac9277e', false],
        ['7c15ffbd38fc78bfa1b12268f48c2ed256e6b8dd865061a1eb6d8952c9fcd56b', false]
      ];

      hashData.forEach(function check(d){
        b.hasTransaction(d[0]).should.equal(d[1]);
      });

    });

  });

});
