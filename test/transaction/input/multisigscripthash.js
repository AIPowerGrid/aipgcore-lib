'use strict';
/* jshint unused: false */

var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');

var aipgcore = require('../../..');
var Transaction = aipgcore.Transaction;
var PrivateKey = aipgcore.PrivateKey;
var Address = aipgcore.Address;
var Script = aipgcore.Script;
var Signature = aipgcore.crypto.Signature;
var MultiSigScriptHashInput = aipgcore.Transaction.Input.MultiSigScriptHash;

describe('MultiSigScriptHashInput', function() {

  var privateKey1 = new PrivateKey('Kz3KiyvEXzGM16hRRycJoHJsmRD3c21G2iqVp2mLUWSViidvvZB5');
  var privateKey2 = new PrivateKey('Kyn8k5j31SR9k6ceKEa7N1KLem99LPCMC5fr87au57kXyPJkbWDT');
  var privateKey3 = new PrivateKey('L2m1zT6oM6gmATdTTnfbqVPsXqTpaPfyvnVq15xAADtAjLoMYqan');
  var public1 = privateKey1.publicKey;
  var public2 = privateKey2.publicKey;
  var public3 = privateKey3.publicKey;
  var address = new Address('rFC2FaRuQVadQvKjPrde1rz6VufUyLZ7iM');

  var output = {
    address: 'rFC2FaRuQVadQvKjPrde1rz6VufUyLZ7iM',
    txId: '39673a2860b027b426b2be8d45b3100532562abd55aa1643e5c81715e8d29205',
    outputIndex: 0,
    script: new Script(address),
    satoshis: 1000000
  };
  it('can count missing signatures', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    input.countSignatures().should.equal(0);

    transaction.sign(privateKey1);
    input.countSignatures().should.equal(1);
    input.countMissingSignatures().should.equal(1);
    input.isFullySigned().should.equal(false);

    transaction.sign(privateKey2);
    input.countSignatures().should.equal(2);
    input.countMissingSignatures().should.equal(0);
    input.isFullySigned().should.equal(true);
  });
  it('returns a list of public keys with missing signatures', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    _.every(input.publicKeysWithoutSignature(), function(publicKeyMissing) {
      var serialized = publicKeyMissing.toString();
      return serialized === public1.toString() ||
              serialized === public2.toString() ||
              serialized === public3.toString();
    }).should.equal(true);
    transaction.sign(privateKey1);
    _.every(input.publicKeysWithoutSignature(), function(publicKeyMissing) {
      var serialized = publicKeyMissing.toString();
      return serialized === public2.toString() ||
              serialized === public3.toString();
    }).should.equal(true);
  });
  it('can clear all signatures', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000)
      .sign(privateKey1)
      .sign(privateKey2);

    var input = transaction.inputs[0];
    input.isFullySigned().should.equal(true);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });
  it('can estimate how heavy is the output going to be', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    input._estimateSize().should.equal(257);
  });
  it('uses SIGHASH_ALL by default', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var sigs = input.getSignatures(transaction, privateKey1, 0);
    sigs[0].sigtype.should.equal(Signature.SIGHASH_ALL);
  });
  it('roundtrips to/from object', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000)
      .sign(privateKey1);
    var input = transaction.inputs[0];
    var roundtrip = new MultiSigScriptHashInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('roundtrips to/from object when not signed', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var roundtrip = new MultiSigScriptHashInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('will get the scriptCode for nested witness', function() {
    var address = Address.createMultisig([public1, public2, public3], 2, 'testnet', true);
    var utxo = {
      address: address.toString(),
      txId: '39673a2860b027b426b2be8d45b3100532562abd55aa1643e5c81715e8d29205',
      outputIndex: 0,
      script: new Script(address),
      satoshis: 1000000
    };
    var transaction = new Transaction()
      .from(utxo, [public1, public2, public3], 2, true)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var scriptCode = input.getScriptCode();
    scriptCode.toString('hex').should.equal('69522102e1897e5759759416a760e9f3656b7c18ec0961f5148546fb0b8fe48e4029c35721039fd349bcf87db08c76862cb43f655a8fadaadd5687e0ea432f43b29470fce2a72103fe128bfb02304a6946e63c3a484371759a60a9a60c5993bb011856bb069da66853ae');
  });
  it('will get the satoshis buffer for nested witness', function() {
    var address = Address.createMultisig([public1, public2, public3], 2, 'testnet', true);
    var utxo = {
      address: address.toString(),
      txId: '39673a2860b027b426b2be8d45b3100532562abd55aa1643e5c81715e8d29205',
      outputIndex: 0,
      script: new Script(address),
      satoshis: 1000000
    };
    var transaction = new Transaction()
      .from(utxo, [public1, public2, public3], 2, true)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var satoshisBuffer = input.getSatoshisBuffer();
    satoshisBuffer.toString('hex').should.equal('40420f0000000000');
  });

});
