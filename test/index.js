'use strict';

var should = require('chai').should();
var aipgcore = require('../');

describe('#versionGuard', function() {
  it('global._aipgcore should be defined', function() {
    should.equal(global._aipgcore, aipgcore.version);
  });

  it('throw an error if version is already defined', function() {
    (function() {
      aipgcore.versionGuard('version');
    }).should.throw('More than one instance of aipgcore');
  });
});
