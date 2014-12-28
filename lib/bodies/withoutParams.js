var utils, withoutParams;

utils = require('../utils');


/**
 * .
 */

module.exports = withoutParams = function(fn) {
  var codeForInvoke;
  if (typeof fn === 'function') {
    codeForInvoke = 'fn.apply(this, arguments)';
  } else if (typeof fn === 'string') {
    codeForInvoke = "this" + (utils.generatePropertyAccess(fn)) + ".apply(this, arguments)";
  } else {
    throw new TypeError(utils.format('%s can not be injectified', typeof fn));
  }
  return "var promise = Promise.resolve(" + codeForInvoke + ");";
};
