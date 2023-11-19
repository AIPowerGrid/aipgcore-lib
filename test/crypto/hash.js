'use strict';

require('chai').should();
var aipgcore = require('../..');
var Hash = aipgcore.crypto.Hash;

describe('Hash', function() {
  var buf = new Buffer([0, 1, 2, 3, 253, 254, 255]);
  var str = 'test string';

  describe('@sha1', function() {

    it('calculates the hash of this buffer correctly', function() {
      var hash = Hash.sha1(buf);
      hash.toString('hex').should.equal('de69b8a4a5604d0486e6420db81e39eb464a17b2');
      hash = Hash.sha1(new Buffer(0));
      hash.toString('hex').should.equal('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });

    it('throws an error when the input is not a buffer', function() {
      Hash.sha1.bind(Hash, str).should.throw('Invalid Argument');
    });

  });

  describe('#sha256', function() {

    it('calculates the hash of this buffer correctly', function() {
      var hash = Hash.sha256(buf);
      hash.toString('hex').should.equal('6f2c7b22fd1626998287b3636089087961091de80311b9279c4033ec678a83e8');
    });

    it('fails when the input is not a buffer', function() {
      Hash.sha256.bind(Hash, str).should.throw('Invalid Argument');
    });

  });

  describe('#sha256hmac', function() {

    it('computes this known big key correctly', function() {
      var key = new Buffer('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad' +
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad' +
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad' +
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');
      var data = new Buffer('');
      Hash.sha256hmac(data, key).toString('hex')
        .should.equal('fb1f87218671f1c0c4593a88498e02b6dfe8afd814c1729e89a1f1f6600faa23');
    });

    it('computes this known empty test vector correctly', function() {
      var key = new Buffer('');
      var data = new Buffer('');
      Hash.sha256hmac(data, key).toString('hex')
        .should.equal('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');
    });

    it('computes this known non-empty test vector correctly', function() {
      var key = new Buffer('key');
      var data = new Buffer('The quick brown fox jumps over the lazy dog');
      Hash.sha256hmac(data, key).toString('hex')
        .should.equal('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
    });

  });

  describe('#sha256sha256', function() {

    it('calculates the hash of this buffer correctly', function() {
      var hash = Hash.sha256sha256(buf);
      hash.toString('hex').should.equal('be586c8b20dee549bdd66018c7a79e2b67bb88b7c7d428fa4c970976d2bec5ba');
    });

    it('fails when the input is not a buffer', function() {
      Hash.sha256sha256.bind(Hash, str).should.throw('Invalid Argument');
    });

  });

  describe('#sha256ripemd160', function() {

    it('calculates the hash of this buffer correctly', function() {
      var hash = Hash.sha256ripemd160(buf);
      hash.toString('hex').should.equal('7322e2bd8535e476c092934e16a6169ca9b707ec');
    });

    it('fails when the input is not a buffer', function() {
      Hash.sha256ripemd160.bind(Hash, str).should.throw('Invalid Argument');
    });

  });

  describe('#ripemd160', function() {

    it('calculates the hash of this buffer correctly', function() {
      var hash = Hash.ripemd160(buf);
      hash.toString('hex').should.equal('fa0f4565ff776fee0034c713cbf48b5ec06b7f5c');
    });

    it('fails when the input is not a buffer', function() {
      Hash.ripemd160.bind(Hash, str).should.throw('Invalid Argument');
    });

  });

  describe('#sha512', function() {

    it('calculates the hash of this buffer correctly', function() {
      var hash = Hash.sha512(buf);
      hash.toString('hex')
        .should.equal('c0530aa32048f4904ae162bc14b9eb535eab6c465e960130005fedd' +
          'b71613e7d62aea75f7d3333ba06e805fc8e45681454524e3f8050969fe5a5f7f2392e31d0');
    });

    it('fails when the input is not a buffer', function() {
      Hash.sha512.bind(Hash, str).should.throw('Invalid Argument');
    });

  });

  describe('#sha512hmac', function() {

    it('calculates this known empty test vector correctly', function() {
      var hex = 'b936cee86c9f87aa5d3c6f2e84cb5a4239a5fe50480a6ec66b70ab5b1f4a' +
        'c6730c6c515421b327ec1d69402e53dfb49ad7381eb067b338fd7b0cb22247225d47';
      Hash.sha512hmac(new Buffer([]), new Buffer([])).toString('hex').should.equal(hex);
    });

    it('calculates this known non-empty test vector correctly', function() {
      var hex = 'c40bd7c15aa493b309c940e08a73ffbd28b2e4cb729eb94480d727e4df577' +
        'b13cc403a78e6150d83595f3b17c4cc331f12ca5952691de3735a63c1d4c69a2bac';
      var data = new Buffer('test1');
      var key = new Buffer('test2');
      Hash.sha512hmac(data, key).toString('hex').should.equal(hex);
    });

  });
  describe('#x16r', function() {


    it('calculates x16r hash correctly', function() {
      var headers = [ "00000020bd262b09846f3b30aeb33bea9c5acc3fece16c510163d27da99064aae200000014b58065de1463df1f23ce19a950adddd6a7456b6913bd9eb021a59958e9c9cf884e4d5affff001e050b0000", "00000020d38f4b32bafab48bd602e03245cadeeb09486c8809ed6ca484dee3023a000000b7a1afe300841252cc068c31e8cfadd00e50e5a9faf970ca84a8da5ae7100401994e4d5affff001e268a0500", "000000202a29a5aaabb793bd12d2858ffd35d96e162ae614264d6e36c4733b5f2a00000079dedf9b185692dcaa84efa8674c94a69389445635db278fcd52dfd04f9a1e13a04e4d5affff001ef9210200" ];
      var hashes = [ "0000003a02e3de84a46ced09886c4809ebdeca4532e002d68bb4faba324b8fd3" , "0000002a5f3b73c4366e4d2614e62a166ed935fd8f85d212bd93b7abaaa5292a", "000000a123ae742de194b6db9f3768e2a1dcd43470912d4524aa79d80a1ffd1b" ];

      headers.forEach(function(header, i) {
        var data = new Buffer(header, 'hex');
        Hash.x16r(data).toString('hex').should.equal(hashes[i]);
      });
    });

  });

  describe('#x16rv2', function() {
    it('calculates x16rv2 hash correctly', function() {
      var headers = [ "00000020bd262b09846f3b30aeb33bea9c5acc3fece16c510163d27da99064aae200000014b58065de1463df1f23ce19a950adddd6a7456b6913bd9eb021a59958e9c9cf884e4d5affff001e050b0000", "00000020d38f4b32bafab48bd602e03245cadeeb09486c8809ed6ca484dee3023a000000b7a1afe300841252cc068c31e8cfadd00e50e5a9faf970ca84a8da5ae7100401994e4d5affff001e268a0500", "000000202a29a5aaabb793bd12d2858ffd35d96e162ae614264d6e36c4733b5f2a00000079dedf9b185692dcaa84efa8674c94a69389445635db278fcd52dfd04f9a1e13a04e4d5affff001ef9210200" ];
      var hashes = [ "455ed0ae063dd8b8696637c760807ad1384c6d957d62f47be83d4a94834904b1" , "c8b72b1c4cf9a828ba9723e8cb76822be3595fe8efc56440ce213f3cd87d2ce6", "000000a123ae742de194b6db9f3768e2a1dcd43470912d4524aa79d80a1ffd1b" ];

      headers.forEach(function(header, i) {
        var data = new Buffer(header, 'hex');
        Hash.x16rv2(data).toString('hex').should.equal(hashes[i]);
      });
    });

  });

});
