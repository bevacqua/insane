'use strict';

var he = require('he');
var parser = require('./parser');
var sanitizer = require('./sanitizer');
var defaults = require('./defaults');
var assign = require('./assign');

function insane (html, options, strict) {
  var buffer = [];
  var configuration = strict === true ? options : assign({}, defaults, options);
  var handler = sanitizer(buffer, configuration);

  parser(html, handler);

  return buffer.join('');
}

insane.defaults = defaults;
module.exports = insane;
