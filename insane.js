'use strict';

var he = require('he');
var parser = require('./parser');
var sanitizer = require('./sanitizer');
var defaults = require('./defaults');

function insane (html, options) {
  var buffer = [];
  var handler = sanitizer(buffer, options || defaults);

  parser(html, handler);

  return buffer.join('');
}

insane.defaults = defaults;
module.exports = insane;
