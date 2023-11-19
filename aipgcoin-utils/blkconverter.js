'use strict';

// execution
// enable rest in aipg.conf 'rest=1' (be sure to disable after)
// node ./aipgcoin-utils/blkconverter.js

// convert block json from aipgd format to aipgcore format

// get ./aipgcoin-utils/inputs/blk220909.dat by:
// curl 127.0.0.1:8766/rest/block/000000000001a87be937e85123bf209af485cf94b6cae8125dce2f5a9914ecfb.hex | xxd -r -p > ./aipgcoin-utils/inputs/blk220909.dat

// get ./aipgcoin-utils/inputs/blk220909.json by
// curl 127.0.0.1:8766/rest/block/000000000001a87be937e85123bf209af485cf94b6cae8125dce2f5a9914ecfb.json > ./aipgcoin-utils/inputs/blk220909.json

// get ./aipgcoin-utils/inputs/blk220909.js by manually edit the file

// Manually check if blk220909-aipgcore.json match with blk220909.json

var aipgcore = require('..');
var Block = aipgcore.Block;
var fs = require('fs');

var first8Bytes = new Buffer ([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]); // won't be used in block allocation, just fill with some inane values

var blockBuffer = fs.readFileSync('aipgcoin-utils/inputs/blk220909.dat');

var aipgcoreFormatBlockBuffer = Buffer.concat([first8Bytes, blockBuffer]);

var blk = Block.fromRawBlock(aipgcoreFormatBlockBuffer);

var blkJSON = blk.toJSON();
var blkJSONStr = JSON.stringify(blkJSON, null, 2);

fs.writeFileSync('aipgcoin-utils/outputs/blk220909-aipgcore.dat', aipgcoreFormatBlockBuffer);
fs.writeFileSync('aipgcoin-utils/outputs/blk220909-aipgcore.json', blkJSONStr);
