'use strict';

var fs = require('fs');
var test = require('tape');
var sinon = require('sinon');
var insane = require('..');
var dirty = read('dirty');
var dirtyExpected = read('dirty-expected');

function read (file) {
  return fs.readFileSync('./test/fixtures/' + file + '.html', 'utf8');
}

test('succeeds because of sensible defaults', function (t) {
  t.equal(insane(dirty), dirtyExpected);
  t.end();
});
