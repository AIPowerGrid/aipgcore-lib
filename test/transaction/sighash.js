'use strict';

var buffer = require('buffer');

var chai = require('chai');
var should = chai.should();
var aipgcore = require('../../');
var Script = aipgcore.Script;
var Transaction = aipgcore.Transaction;
var sighash = Transaction.sighash;

var vectors_sighash = require('../data/sighash.json');

describe('sighash', function() {

  vectors_sighash.forEach(function(vector, i) {
    if (i === 0) {
      // First element is just a row describing the next ones
      return;
    }
    it('test vector from aipgd #' + i + ' (' + vector[4].substring(0, 16) + ')', function() {
      var txbuf = buffer.Buffer.from(vector[0], 'hex');
      var scriptbuf = buffer.Buffer.from(vector[1], 'hex');
      var subscript = Script(scriptbuf);
      var nin = vector[2];
      var nhashtype = vector[3];
      var sighashbuf = buffer.Buffer.from(vector[4], 'hex');
      var tx = new Transaction(txbuf);

      //make sure transacion to/from buffer is isomorphic
      tx.uncheckedSerialize().should.equal(txbuf.toString('hex'));

      //sighash ought to be correct
      sighash.sighash(tx, nhashtype, nin, subscript).toString('hex').should.equal(sighashbuf.toString('hex'));
    });
  });
});
