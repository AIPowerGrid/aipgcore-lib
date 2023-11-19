'use strict';

// Relax some linter options:
//   * quote marks so "m/0'/1/2'/" doesn't need to be scaped
//   * too many tests, maxstatements -> 100
//   * store test vectors at the end, latedef: false
//   * should call is never defined
/* jshint quotmark: false */
/* jshint latedef: false */
/* jshint maxstatements: 100 */
/* jshint unused: false */

var _ = require('lodash');
var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var aipgcore = require('..');
var Networks = aipgcore.Networks;
var HDPrivateKey = aipgcore.HDPrivateKey;
var HDPublicKey = aipgcore.HDPublicKey;

describe('HDKeys building with static methods', function() {
  var classes = [HDPublicKey, HDPrivateKey];
  var clazz, index;

  _.each(classes, function(clazz) {
    var expectStaticMethodFail = function(staticMethod, argument, message) {
      expect(clazz[staticMethod].bind(null, argument)).to.throw(message);
    };
    it(clazz.name + ' fromJSON checks that a valid JSON is provided', function() {
      var errorMessage = 'Invalid Argument: No valid argument was provided';
      var method = 'fromObject';
      expectStaticMethodFail(method, undefined, errorMessage);
      expectStaticMethodFail(method, null, errorMessage);
      expectStaticMethodFail(method, 'invalid JSON', errorMessage);
      expectStaticMethodFail(method, '{\'singlequotes\': true}', errorMessage);
    });
    it(clazz.name + ' fromString checks that a string is provided', function() {
      var errorMessage = 'No valid string was provided';
      var method = 'fromString';
      expectStaticMethodFail(method, undefined, errorMessage);
      expectStaticMethodFail(method, null, errorMessage);
      expectStaticMethodFail(method, {}, errorMessage);
    });
    it(clazz.name + ' fromObject checks that an object is provided', function() {
      var errorMessage = 'No valid argument was provided';
      var method = 'fromObject';
      expectStaticMethodFail(method, undefined, errorMessage);
      expectStaticMethodFail(method, null, errorMessage);
      expectStaticMethodFail(method, '', errorMessage);
    });
  });
});

describe('BIP32 compliance', function() {

  it('should initialize test vector 1 from the extended public key', function() {
    new HDPublicKey(vector1_m_public).xpubkey.should.equal(vector1_m_public);
  });

  it('should initialize test vector 1 from the extended private key', function() {
    new HDPrivateKey(vector1_m_private).xprivkey.should.equal(vector1_m_private);
  });

  it('can initialize a public key from an extended private key', function() {
    new HDPublicKey(vector1_m_private).xpubkey.should.equal(vector1_m_public);
  });

  it('toString should be equal to the `xpubkey` member', function() {
    var privateKey = new HDPrivateKey(vector1_m_private);
    privateKey.toString().should.equal(privateKey.xprivkey);
  });

  it('toString should be equal to the `xpubkey` member', function() {
    var publicKey = new HDPublicKey(vector1_m_public);
    publicKey.toString().should.equal(publicKey.xpubkey);
  });

  it('should get the extended public key from the extended private key for test vector 1', function() {
    HDPrivateKey(vector1_m_private).xpubkey.should.equal(vector1_m_public);
  });

  it("should get m/0' ext. private key from test vector 1", function() {
    var privateKey = new HDPrivateKey(vector1_m_private).derive("m/0'");
    privateKey.xprivkey.should.equal(vector1_m0h_private);
  });

  it("should get m/0' ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'")
      .xpubkey.should.equal(vector1_m0h_public);
  });

  it("should get m/0'/1 ext. private key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1")
      .xprivkey.should.equal(vector1_m0h1_private);
  });

  it("should get m/0'/1 ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1")
      .xpubkey.should.equal(vector1_m0h1_public);
  });

  it("should get m/0'/1 ext. public key from m/0' public key from test vector 1", function() {
    var derivedPublic = HDPrivateKey(vector1_m_private).derive("m/0'").hdPublicKey.derive("m/1");
    derivedPublic.xpubkey.should.equal(vector1_m0h1_public);
  });

  it("should get m/0'/1/2' ext. private key from test vector 1", function() {
    var privateKey = new HDPrivateKey(vector1_m_private);
    var derived = privateKey.derive("m/0'/1/2'");
    derived.xprivkey.should.equal(vector1_m0h12h_private);
  });

  it("should get m/0'/1/2' ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'")
      .xpubkey.should.equal(vector1_m0h12h_public);
  });

  it("should get m/0'/1/2'/2 ext. private key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2")
      .xprivkey.should.equal(vector1_m0h12h2_private);
  });

  it("should get m/0'/1/2'/2 ext. public key from m/0'/1/2' public key from test vector 1", function() {
    var derived = HDPrivateKey(vector1_m_private).derive("m/0'/1/2'").hdPublicKey;
    derived.derive("m/2").xpubkey.should.equal(vector1_m0h12h2_public);
  });

  it("should get m/0'/1/2h/2 ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2")
      .xpubkey.should.equal(vector1_m0h12h2_public);
  });

  it("should get m/0'/1/2h/2/1000000000 ext. private key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2/1000000000")
      .xprivkey.should.equal(vector1_m0h12h21000000000_private);
  });

  it("should get m/0'/1/2h/2/1000000000 ext. public key from test vector 1", function() {
    HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2/1000000000")
      .xpubkey.should.equal(vector1_m0h12h21000000000_public);
  });

  it("should get m/0'/1/2'/2/1000000000 ext. public key from m/0'/1/2'/2 public key from test vector 1", function() {
    var derived = HDPrivateKey(vector1_m_private).derive("m/0'/1/2'/2").hdPublicKey;
    derived.derive("m/1000000000").xpubkey.should.equal(vector1_m0h12h21000000000_public);
  });

  it('should initialize test vector 2 from the extended public key', function() {
    HDPublicKey(vector2_m_public).xpubkey.should.equal(vector2_m_public);
  });

  it('should initialize test vector 2 from the extended private key', function() {
    HDPrivateKey(vector2_m_private).xprivkey.should.equal(vector2_m_private);
  });

  it('should get the extended public key from the extended private key for test vector 2', function() {
    HDPrivateKey(vector2_m_private).xpubkey.should.equal(vector2_m_public);
  });

  it("should get m/0 ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive(0).xprivkey.should.equal(vector2_m0_private);
  });

  it("should get m/0 ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive(0).xpubkey.should.equal(vector2_m0_public);
  });

  it("should get m/0 ext. public key from m public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).hdPublicKey.derive(0).xpubkey.should.equal(vector2_m0_public);
  });

  it("should get m/0/2147483647h ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'")
      .xprivkey.should.equal(vector2_m02147483647h_private);
  });

  it("should get m/0/2147483647h ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'")
      .xpubkey.should.equal(vector2_m02147483647h_public);
  });

  it("should get m/0/2147483647h/1 ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1")
      .xprivkey.should.equal(vector2_m02147483647h1_private);
  });

  it("should get m/0/2147483647h/1 ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1")
      .xpubkey.should.equal(vector2_m02147483647h1_public);
  });

  it("should get m/0/2147483647h/1 ext. public key from m/0/2147483647h public key from test vector 2", function() {
    var derived = HDPrivateKey(vector2_m_private).derive("m/0/2147483647'").hdPublicKey;
    derived.derive(1).xpubkey.should.equal(vector2_m02147483647h1_public);
  });

  it("should get m/0/2147483647h/1/2147483646h ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'")
      .xprivkey.should.equal(vector2_m02147483647h12147483646h_private);
  });

  it("should get m/0/2147483647h/1/2147483646h ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'")
      .xpubkey.should.equal(vector2_m02147483647h12147483646h_public);
  });

  it("should get m/0/2147483647h/1/2147483646h/2 ext. private key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'/2")
      .xprivkey.should.equal(vector2_m02147483647h12147483646h2_private);
  });

  it("should get m/0/2147483647h/1/2147483646h/2 ext. public key from test vector 2", function() {
    HDPrivateKey(vector2_m_private).derive("m/0/2147483647'/1/2147483646'/2")
      .xpubkey.should.equal(vector2_m02147483647h12147483646h2_public);
  });

  it("should get m/0/2147483647h/1/2147483646h/2 ext. public key from m/0/2147483647h/2147483646h public key from test vector 2", function() {
    var derivedPublic = HDPrivateKey(vector2_m_private)
      .derive("m/0/2147483647'/1/2147483646'").hdPublicKey;
    derivedPublic.derive("m/2")
      .xpubkey.should.equal(vector2_m02147483647h12147483646h2_public);
  });

  it('should use full 32 bytes for private key data that is hashed (as per bip32)', function() {
    // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
    var privateKeyBuffer = new Buffer('00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd', 'hex');
    var chainCodeBuffer = new Buffer('9c8a5c863e5941f3d99453e6ba66b328bb17cf0b8dec89ed4fc5ace397a1c089', 'hex');
    var key = HDPrivateKey.fromObject({
      network: 'testnet',
      depth: 0,
      parentFingerPrint: 0,
      childIndex: 0,
      privateKey: privateKeyBuffer,
      chainCode: chainCodeBuffer
    });
    var derived = key.deriveChild("m/44'/0'/0'/0/0'");
    derived.privateKey.toString().should.equal('3348069561d2a0fb925e74bf198762acc47dce7db27372257d2d959a9e6f8aeb');
  });

  it('should NOT use full 32 bytes for private key data that is hashed with nonCompliant flag', function() {
    // This is to test that the previously implemented non-compliant to BIP32
    var privateKeyBuffer = new Buffer('00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd', 'hex');
    var chainCodeBuffer = new Buffer('9c8a5c863e5941f3d99453e6ba66b328bb17cf0b8dec89ed4fc5ace397a1c089', 'hex');
    var key = HDPrivateKey.fromObject({
      network: 'testnet',
      depth: 0,
      parentFingerPrint: 0,
      childIndex: 0,
      privateKey: privateKeyBuffer,
      chainCode: chainCodeBuffer
    });
    var derived = key.deriveNonCompliantChild("m/44'/0'/0'/0/0'");
    derived.privateKey.toString().should.equal('4811a079bab267bfdca855b3bddff20231ff7044e648514fa099158472df2836');
  });

  it('should NOT use full 32 bytes for private key data that is hashed with the nonCompliant derive method', function() {
    // This is to test that the previously implemented non-compliant to BIP32
    var privateKeyBuffer = new Buffer('00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd', 'hex');
    var chainCodeBuffer = new Buffer('9c8a5c863e5941f3d99453e6ba66b328bb17cf0b8dec89ed4fc5ace397a1c089', 'hex');
    var key = HDPrivateKey.fromObject({
      network: 'testnet',
      depth: 0,
      parentFingerPrint: 0,
      childIndex: 0,
      privateKey: privateKeyBuffer,
      chainCode: chainCodeBuffer
    });
    var derived = key.derive("m/44'/0'/0'/0/0'");
    derived.privateKey.toString().should.equal('4811a079bab267bfdca855b3bddff20231ff7044e648514fa099158472df2836');
  });

  describe('edge cases', function() {
    var sandbox = sinon.sandbox.create();
    afterEach(function() {
      sandbox.restore();
    });
    it('will handle edge case that derived private key is invalid', function() {
      var invalid = new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
      var privateKeyBuffer = new Buffer('5f72914c48581fc7ddeb944a9616389200a9560177d24f458258e5b04527bcd1', 'hex');
      var chainCodeBuffer = new Buffer('39816057bba9d952fe87fe998b7fd4d690a1bb58c2ff69141469e4d1dffb4b91', 'hex');
      var unstubbed = aipgcore.crypto.BN.prototype.toBuffer;
      var count = 0;
      var stub = sandbox.stub(aipgcore.crypto.BN.prototype, 'toBuffer', function(args) {
        // On the fourth call to the function give back an invalid private key
        // otherwise use the normal behavior.
        count++;
        if (count === 4) {
          return invalid;
        }
        var ret = unstubbed.apply(this, arguments);
        return ret;
      });
      sandbox.spy(aipgcore.PrivateKey, 'isValid');
      var key = HDPrivateKey.fromObject({
        network: 'testnet',
        depth: 0,
        parentFingerPrint: 0,
        childIndex: 0,
        privateKey: privateKeyBuffer,
        chainCode: chainCodeBuffer
      });
      var derived = key.derive("m/44'");
      derived.privateKey.toString().should.equal('b15bce3608d607ee3a49069197732c656bca942ee59f3e29b4d56914c1de6825');
      aipgcore.PrivateKey.isValid.callCount.should.equal(2);
    });
    it('will handle edge case that a derive public key is invalid', function() {
      var publicKeyBuffer = new Buffer('029e58b241790284ef56502667b15157b3fc58c567f044ddc35653860f9455d099', 'hex');
      var chainCodeBuffer = new Buffer('39816057bba9d952fe87fe998b7fd4d690a1bb58c2ff69141469e4d1dffb4b91', 'hex');
      var key = new HDPublicKey({
        network: 'testnet',
        depth: 0,
        parentFingerPrint: 0,
        childIndex: 0,
        chainCode: chainCodeBuffer,
        publicKey: publicKeyBuffer
      });
      var unstubbed = aipgcore.PublicKey.fromPoint;
      aipgcore.PublicKey.fromPoint = function() {
        aipgcore.PublicKey.fromPoint = unstubbed;
        throw new Error('Point cannot be equal to Infinity');
      };
      sandbox.spy(key, '_deriveWithNumber');
      var derived = key.derive("m/44");
      key._deriveWithNumber.callCount.should.equal(2);
      key.publicKey.toString().should.equal('029e58b241790284ef56502667b15157b3fc58c567f044ddc35653860f9455d099');
    });
  });

  describe('seed', function() {

    it('should initialize a new BIP32 correctly from test vector 1 seed', function() {
      var seededKey = HDPrivateKey.fromSeed(vector1_master, Networks.livenet);
      seededKey.xprivkey.should.equal(vector1_m_private);
      seededKey.xpubkey.should.equal(vector1_m_public);
    });

    it('should initialize a new BIP32 correctly from test vector 2 seed', function() {
      var seededKey = HDPrivateKey.fromSeed(vector2_master, Networks.livenet);
      seededKey.xprivkey.should.equal(vector2_m_private);
      seededKey.xpubkey.should.equal(vector2_m_public);
    });
  });
});

//test vectors: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
var vector1_master = '000102030405060708090a0b0c0d0e0f';
var vector1_m_public = 'xpub661MyMwAqRbcGC8aFmJdZ6TZ2fVywEyZeuayK5RmT4V2as9NhSybkWeTG64KMZqFj8PnAzMRShL3fNPLbioYwQgqHckngNc7mntdYT5yp29';
var vector1_m_private = 'xprv9s21ZrQH143K3i479jmdBxWpUdfVXnFiHgfNWh29tix3i4pE9ufMCiKyQoVy5HkLJs9ZPGHNJ1f8KyUc5xgpgRasyn2xfM5MoWhVKte7mPL';
var vector1_m0h_public = 'xpub69KVYEzMQxBEwyzVoDeqKr5g2GMcMVFD8TDg4eVft6zhcSpncjwnR4kdPX4fA6W72C7C58wuEmaTpRqd1qumk6ctvHDhSytEsqiZP1cddE4';
var vector1_m0h_private = 'xprv9vL98jTTaacwjVv2hC7pxi8wUEX7x2XMmEJ5GG64KmTijeVe5CdXsGS9YFGVimuyb2wBLs1BK3EasevvcR3bcmE5jJiodakywHjnyHGPNet';
var vector1_m0h1_public = 'xpub6AdUoJMLuJj4Lgvz2Y2yW1r2VFkcVzThAZ4orCESPfpjU86fYHjQyds4ascC8hUJogvjS7ku4qcGaTqTM2SzKEsNZR4xWMWFscp8iV17V8j';
var vector1_m0h1_private = 'xprv9we8PnpT4wAm8CrWvWVy8suHwDv86XjqoL9D3oppqLHkbKmWzkRARqYajcPXVaFHVAsf7Sjzjg15G3ah5n6QfLsGMdBQB4WhApDZR2F8a8M';
var vector1_m0h12h_public = 'xpub6C6PtwtJRy9FtmLgBbe3YgyeSsJK1ywAdB5963GVhdaEPTYViKNMz3XaM8LRDVW8ud4SYFbYq4e5UNunBimpSD6JuHd45JdScb4fhzqZrXV';
var vector1_m0h12h_private = 'xprv9y73VSMQbbaxgHGD5a73BZ2utqTpcXDKFx9YHert9J3FWfDMAn47SFD6VsDU2ZSu8qNpMWixhdjCrwUdd7oK6DUGjbhTHjHxvVCt25onr6M';
var vector1_m0h12h2_public = 'xpub6Ek6c67Vp4WpBjdffBbPrPkzCA7vAXX8DTX8zVunc9b7D6BHaNwXTqKqNS98xy6UmbHaFpnzqAKGuZBFwdSQ6q3Jtd74hjid4U9dxBdqyQy';
var vector1_m0h12h2_private = 'xprvA1kkCaabygxWyFZCZA4PVFpFe8HRm4oGrEbYC7WB3p48LHr92qdGv31MXADWT9cMGHf955HvRL1FBE3LNirbZvLwnGWg4ingTVadMMSHLi2';
var vector1_m0h12h21000000000_public = 'xpub6FSjypykxreXqp6az6uHwpNLahETXsVFnBPpW3re5nCDv7V5iWC78kW7PoA2bmBcc9bNk6r9dFWkGRaXPYhR82oPme6uapVm6FP8DGHDQrZ';
var vector1_m0h12h21000000000_private = 'xprvA2TPaKSs8V6EdL27t5NHagRc2fPy8QmQQxUDhfT2XSfF3K9wAxsraxBdYW1XGSEFnE7djJZvLJqfFB9FcnAFZhxNM9W18Fz3JMMhBedw3FD';
var vector2_master = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542';
var vector2_m_public = 'xpub661MyMwAqRbcGXiEYFfi3WtTKRWzUTz1TJgiizGoRdodp6P3BwyeWHqMh3FYrrNq1xJPNr2Z2nbwcbzLsoCJjdS9KDsUoEiRaNH2rbjnMtT';
var vector2_m_private = 'xprv9s21ZrQH143K43dmSE8hgNwimPgW51GA65m7vbsBsJGewJ3teQfPxVWsqkUb26mZvb8b7munXoCTrCrN9PaVQ78xPotgfpSmzm2463LRcty';
var vector2_m0_public = 'xpub68PYiGWQzkwvAurETLk1TRgFqxAeuKo1CjMLkPdd7kZYcDun6GU4i3nvXJAu5ZnbPoLCYuFckWFnm5kfSrxLmqD6PV97j3jqA1z28B6Ya2A';
var vector2_m0_private = 'xprv9uQCJkyXAPPcxRmmMKD16HjXHvLAVs59qWRjx1E1ZR2ZjRadYj9pAFUSg458rWaggSqzgcQTE8gqhjb4bfSM5HGXPQb6bxagsrs71fH3YLX';
var vector2_m02147483647h_public = 'xpub6Aa4xvvTdzA71fxaKdPSJkAJWTj82m6M2WpkhGoUps1rAn91JgdzARHDyMPw5WkTUxQ2pJDRH6qC89Y67zJjGz8VUSRV1AyocPtC1ycKuDz';
var vector2_m02147483647h_private = 'xprv9waiZRPZocbooBt7DbrRwcDZxRtddJNVfHu9ttPsGXUsHyorm9Kjccxk85u6suRjzY5U2mjeswCqnNjPyzkWAhkr6jwCB8dA3gJJqtw8SKz';
var vector2_m02147483647h1_public = 'xpub6D4dm464frWzs42NVUt6ML8ZYdLcfWe9NbpWBWoNvBVVoagwwgqxoFprte75Gvi2rqqnDf5gZo6gcrUWkw3KeZChUqkARMGGE64AcTBUJz6';
var vector2_m02147483647h1_private = 'xprv9z5HMYZAqUxheZwuPTM5zCBpzbW8G3vJ1NtuP8PmMqxWvnMoQ9XiFTWP3LbRXEy7djHzY2yEXS44vhVyurr24cMcaSySeDxyqFSmynRP5E8';
var vector2_m02147483647h12147483646h_public = 'xpub6EGuCuYa9kqQVRU8g7AWyqFWj1TJ1syoQ8rq67aXXJC8EMXRUTPY5kzy2nyHU2h3TFd8R8tcZiDG7KJ4oM5ooCpokfdNFjq6AwRs28ymMn3';
var vector2_m02147483647h12147483646h_private = 'xprvA1HYoQ1gKPH7GwPfa5dWchJnAycocRFx2uwEHjAuxxf9MZCGvv5HXxgVBUe6yfRBLMDiq8zXZc1F4skXyJvDfgwLoMCw1jydrJd94xgoN5u';
var vector2_m02147483647h12147483646h2_public = 'xpub6GxsAFpeLFct8cjbpKy4Nqr8C2LjAG8LU1uz1occCbanw91orKCwLd9Q6z1YFFTXqWqTHZyg4HcBDPZ6Fq9eM7HT3ZrUCztTmoLsPQxLG9v';
var vector2_m02147483647h12147483646h2_private = 'xprvA3yWkkHkVt4av8f8iJS41huPdzWEkoQV6nzPDRCzeG3p4LgfJmtgnppvFiw4kDDHp7iKJ8Mc9oorJUeBbr7ofosgh3Eq5MX3pHX7vmJ6Utf';
