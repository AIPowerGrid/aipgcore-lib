'use strict';

// execution
// enable rest in aipg.conf 'rest=1' (be sure to disable after)
// node ./aipgcoin-utils/blkconverter1.js

// convert block json from aipgd format to aipgcore format

// get ./aipgcoin-utils/inputs/blk220909.dat by:
// curl 127.0.0.1:8766/rest/block/00000058bcc33dea08b53691edb9e49a9eb8bac36a0db17eb5a7588860b1f590.hex | xxd -r -p > ./aipgcoin-utils/inputs/blk1.dat

// get ./aipgcoin-utils/inputs/blk220909.json by
// curl 127.0.0.1:8766/rest/block/00000058bcc33dea08b53691edb9e49a9eb8bac36a0db17eb5a7588860b1f590.json > ./aipgcoin-utils/inputs/blk1.json

// get ./aipgcoin-utils/inputs/blk1.js by manually edit the file

// Manually check if blk1-aipgcore.json match with blk1.json

var aipgcore = require('..');
var Block = aipgcore.Block;
var fs = require('fs');

var first8Bytes = new Buffer ([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]); // won't be used in block allocation, just fill with some inane values

var blockBuffer = fs.readFileSync('aipgcoin-utils/inputs/blk1.dat');

var aipgcoreFormatBlockBuffer = Buffer.concat([first8Bytes, blockBuffer]);

var blk = Block.fromRawBlock(aipgcoreFormatBlockBuffer);

var blkJSON = blk.toJSON();
var blkJSONStr = JSON.stringify(blkJSON, null, 2);

fs.writeFileSync('aipgcoin-utils/outputs/blk1-aipgcore.dat', aipgcoreFormatBlockBuffer);
fs.writeFileSync('aipgcoin-utils/outputs/blk1-aipgcore.json', blkJSONStr);
