'use strict';

function assign (accumulator) {
  var stack = Array.prototype.slice.call(arguments, 1);
  var item;
  var key;
  while (stack.length) {
    item = stack.shift();
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (accumulator[key] && typeof accumulator[key] === 'object') {
          accumulator[key] = assign(accumulator[key], item[key]);
        } else {
          accumulator[key] = item[key];
        }
      }
    }
  }
  return accumulator;
}

module.exports = assign;
