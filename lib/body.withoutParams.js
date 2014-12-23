var utils, withoutParams;

utils = require('./utils');


/**
 * .
 */

module.exports = withoutParams = function(fn, context) {
  var codeForInvoke;
  if (typeof fn === 'function') {
    if (context) {
      codeForInvoke = 'fn.apply(context, arguments)';
    } else {
      codeForInvoke = 'fn.apply(this, arguments)';
    }
  } else if (typeof fn === 'string') {
    if (context) {
      codeForInvoke = "context" + (utils.generatePropertyAccess(fn)) + ".apply(context, arguments)";
    } else {
      codeForInvoke = "this" + (utils.generatePropertyAccess(fn)) + ".apply(this, arguments)";
    }
  } else {
    throw new TypeError(utils.format('%s can not be injectified', typeof fn));
  }
  return "var promise = Promise.resolve(" + codeForInvoke + ");";
};
