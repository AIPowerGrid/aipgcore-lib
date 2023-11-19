'use strict';

var aipgcore = module.exports;

// module information
aipgcore.version = 'v' + require('./package.json').version;
aipgcore.versionGuard = function(version) {
  if (version !== undefined) {
    var message = 'More than one instance of aipgcore-lib found. ' +
      'Please make sure to require aipgcore-lib and check that submodules do' +
      ' not also include their own aipgcore-lib dependency.';
    throw new Error(message);
  }
};
aipgcore.versionGuard(global._aipgcore);
global._aipgcore = aipgcore.version;

// crypto
aipgcore.crypto = {};
aipgcore.crypto.BN = require('./lib/crypto/bn');
aipgcore.crypto.ECDSA = require('./lib/crypto/ecdsa');
aipgcore.crypto.Hash = require('./lib/crypto/hash');
aipgcore.crypto.Random = require('./lib/crypto/random');
aipgcore.crypto.Point = require('./lib/crypto/point');
aipgcore.crypto.Signature = require('./lib/crypto/signature');

// encoding
aipgcore.encoding = {};
aipgcore.encoding.Base58 = require('./lib/encoding/base58');
aipgcore.encoding.Base58Check = require('./lib/encoding/base58check');
aipgcore.encoding.BufferReader = require('./lib/encoding/bufferreader');
aipgcore.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
aipgcore.encoding.Varint = require('./lib/encoding/varint');

// utilities
aipgcore.util = {};
aipgcore.util.buffer = require('./lib/util/buffer');
aipgcore.util.js = require('./lib/util/js');
aipgcore.util.preconditions = require('./lib/util/preconditions');

// errors thrown by the library
aipgcore.errors = require('./lib/errors');

// main aipgcoin library
aipgcore.Address = require('./lib/address');
aipgcore.Block = require('./lib/block');
aipgcore.MerkleBlock = require('./lib/block/merkleblock');
aipgcore.BlockHeader = require('./lib/block/blockheader');
aipgcore.HDPrivateKey = require('./lib/hdprivatekey.js');
aipgcore.HDPublicKey = require('./lib/hdpublickey.js');
aipgcore.Networks = require('./lib/networks');
aipgcore.Opcode = require('./lib/opcode');
aipgcore.PrivateKey = require('./lib/privatekey');
aipgcore.PublicKey = require('./lib/publickey');
aipgcore.Script = require('./lib/script');
aipgcore.Transaction = require('./lib/transaction');
aipgcore.URI = require('./lib/uri');
aipgcore.Unit = require('./lib/unit');

// dependencies, subject to change
aipgcore.deps = {};
aipgcore.deps.bnjs = require('bn.js');
aipgcore.deps.bs58 = require('bs58');
aipgcore.deps.Buffer = Buffer;
aipgcore.deps.elliptic = require('elliptic');
aipgcore.deps.nodeX16r = require('node-x16r');
aipgcore.deps.nodeX16rV2 = require('node-x16rv2');
aipgcore.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking
aipgcore.Transaction.sighash = require('./lib/transaction/sighash');
