'use strict';

var aipgcore = require('../..');
var BN = require('../../lib/crypto/bn');
var BufferReader = aipgcore.encoding.BufferReader;
var BufferWriter = aipgcore.encoding.BufferWriter;

var BlockHeader = aipgcore.BlockHeader;
var fs = require('fs');
var should = require('chai').should();

var dataRawBlockBuffer = fs.readFileSync('test/data/blk220909.dat');
var dataRawBlockBinary = fs.readFileSync('test/data/blk220909.dat', 'binary');
var dataRawId = '000000000001a87be937e85123bf209af485cf94b6cae8125dce2f5a9914ecfb';
var data = require('../data/blk220909');

describe('BlockHeader', function() {

  var version = data.version;
  var prevblockidbuf = new Buffer(data.prevblockidhex, 'hex');
  var merklerootbuf = new Buffer(data.merkleroothex, 'hex');
  var time = data.time;
  var bits = data.bits;
  var nonce = data.nonce;
  var bh = new BlockHeader({
    version: version,
    prevHash: prevblockidbuf,
    merkleRoot: merklerootbuf,
    time: time,
    bits: bits,
    nonce: nonce
  });
  var bhhex = data.blockheaderhex;
  var bhbuf = new Buffer(bhhex, 'hex');

  it('should make a new blockheader', function() {
    BlockHeader(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
  });

  it('should not make an empty block', function() {
    (function() {
      BlockHeader();
    }).should.throw('Unrecognized argument for BlockHeader');
  });

  describe('#constructor', function() {

    it('should set all the variables', function() {
      var bh = new BlockHeader({
        version: version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time: time,
        bits: bits,
        nonce: nonce
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.bits);
      should.exist(bh.nonce);
    });

    it('will throw an error if the argument object hash property doesn\'t match', function() {
      (function() {
        var bh = new BlockHeader({
          hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
          version: version,
          prevHash: prevblockidbuf,
          merkleRoot: merklerootbuf,
          time: time,
          bits: bits,
          nonce: nonce
        });
      }).should.throw('Argument object hash property does not match block hash.');
    });

  });

  describe('version', function() {
    it('is interpreted as an int32le', function() {
      var hex = 'ffffffff00000000000000000000000000000000000000000000000000000000000000004141414141414141414141414141414141414141414141414141414141414141010000000200000003000000';
      var header = BlockHeader.fromBuffer(new Buffer(hex, 'hex'));
      header.version.should.equal(-1);
      header.timestamp.should.equal(1);
    });
  });


  describe('#fromObject', function() {

    it('should set all the variables', function() {
      var bh = BlockHeader.fromObject({
        version: version,
        prevHash: prevblockidbuf.toString('hex'),
        merkleRoot: merklerootbuf.toString('hex'),
        time: time,
        bits: bits,
        nonce: nonce
      });
      should.exist(bh.version);
      should.exist(bh.prevHash);
      should.exist(bh.merkleRoot);
      should.exist(bh.time);
      should.exist(bh.bits);
      should.exist(bh.nonce);
    });

  });

  describe('#toJSON', function() {

    it('should set all the variables', function() {
      var json = bh.toJSON();
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.bits);
      should.exist(json.nonce);
    });

  });

  describe('#fromJSON', function() {

    it('should parse this known json string', function() {

      var jsonString = JSON.stringify({
        version: version,
        prevHash: prevblockidbuf,
        merkleRoot: merklerootbuf,
        time: time,
        bits: bits,
        nonce: nonce
      });

      var json = new BlockHeader(JSON.parse(jsonString));
      should.exist(json.version);
      should.exist(json.prevHash);
      should.exist(json.merkleRoot);
      should.exist(json.time);
      should.exist(json.bits);
      should.exist(json.nonce);
    });

  });

  describe('#fromString/#toString', function() {

    it('should output/input a block hex string', function() {
      var b = BlockHeader.fromString(bhhex);
      b.toString().should.equal(bhhex);
    });

  });

  describe('#fromBuffer', function() {

    it('should parse this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#fromBufferReader', function() {

    it('should parse this known buffer', function() {
      BlockHeader.fromBufferReader(BufferReader(bhbuf)).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#toBuffer', function() {

    it('should output this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBuffer().toString('hex').should.equal(bhhex);
    });

  });

  describe('#toBufferWriter', function() {

    it('should output this known buffer', function() {
      BlockHeader.fromBuffer(bhbuf).toBufferWriter().concat().toString('hex').should.equal(bhhex);
    });

    it('doesn\'t create a bufferWriter if one provided', function() {
      var writer = new BufferWriter();
      var blockHeader = BlockHeader.fromBuffer(bhbuf);
      blockHeader.toBufferWriter(writer).should.equal(writer);
    });

  });

  describe('#inspect', function() {

    it('should return the correct inspect of the genesis block', function() {
      var block = BlockHeader.fromRawBlock(dataRawBlockBinary);
      block.inspect().should.equal('<BlockHeader '+dataRawId+'>');
    });

  });

  describe('#fromRawBlock', function() {

    it('should instantiate from a raw block binary', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBinary);
      x.version.should.equal(536870912);
      new BN(x.bits).toString('hex').should.equal('1b032fb5');
    });

    it('should instantiate from raw block buffer', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.version.should.equal(536870912);
      new BN(x.bits).toString('hex').should.equal('1b032fb5');
    });

  });

  describe('#validTimestamp', function() {

    var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);

    it('should validate timpstamp as true', function() {
      var valid = x.validTimestamp(x);
      valid.should.equal(true);
    });


    it('should validate timestamp as false', function() {
      x.time = Math.round(new Date().getTime() / 1000) + BlockHeader.Constants.MAX_TIME_OFFSET + 100;
      var valid = x.validTimestamp(x);
      valid.should.equal(false);
    });

  });

  describe('#validProofOfWork', function() {

    it('should validate proof-of-work as true', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      var valid = x.validProofOfWork(x);
      valid.should.equal(true);

    });

    it('should validate proof of work as false because incorrect proof of work', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      var nonce = x.nonce;
      x.nonce = 0;
      var valid = x.validProofOfWork(x);
      valid.should.equal(false);
      x.nonce = nonce;
    });

  });

  describe('#getDifficulty', function() {
    it('should get the correct difficulty for block 220909', function() {
      var x = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      x.bits.should.equal(0x1b032fb5);
      x.getDifficulty().should.equal(20567.38431479);
    });

    it('should get the correct difficulty for testnet block 552065', function() {
      var x = new BlockHeader({
        bits: 0x1b00c2a8
      });
      x.getDifficulty().should.equal(86187.62562209);
    });

    it('should get the correct difficulty for livenet block 373043', function() {
      var x = new BlockHeader({
        bits: 0x18134dc1
      });
      x.getDifficulty().should.equal(56957648455.01001);
    });

    it('should get the correct difficulty for livenet block 340000', function() {
      var x = new BlockHeader({
        bits: 0x1819012f
      });
      x.getDifficulty().should.equal(43971662056.08958);
    });

    it('should use exponent notation if difficulty is larger than Javascript number', function() {
      var x = new BlockHeader({
        bits: 0x0900c2a8
      });
      x.getDifficulty().should.equal(1.9220482782645836 * 1e48);
    });
  });

  it('coverage: caches the "_id" property', function() {
      var blockHeader = BlockHeader.fromRawBlock(dataRawBlockBuffer);
      blockHeader.id.should.equal(blockHeader.id);
  });

});
