var utils, withParams;

utils = require('../utils');


/**
 * .
 */

module.exports = withParams = function(fn, context, params) {
  var codeForInjects, codeForInvoke, codeForValidates;
  if (typeof fn === 'function') {
    if (context) {
      codeForInvoke = 'fn.apply(context, args)';
    } else {
      codeForInvoke = 'fn.apply(self, args)';
    }
  } else if (typeof fn === 'string') {
    if (context) {
      codeForInvoke = "context" + (utils.generatePropertyAccess(fn)) + ".apply(context, args)";
    } else {
      codeForInvoke = "self" + (utils.generatePropertyAccess(fn)) + ".apply(self, args)";
    }
  } else {
    throw new TypeError(utils.format('%s can not be injectified', typeof fn));
  }
  codeForValidates = '';
  params.forEach(function(name, index) {
    return codeForValidates += "if (typeof injects[" + index + "] !== 'function') { return Promise.reject(new Error('missing an injection')); }";
  });
  codeForInjects = '';
  if (context) {
    params.forEach(function(name, index) {
      return codeForInjects += "injects[" + index + "].call(context), ";
    });
  } else {
    params.forEach(function(name, index) {
      return codeForInjects += "injects[" + index + "].call(self), ";
    });
  }
  return "var injects = injectified.__injections__; " + codeForValidates + " var self = this; var otherArgs = utils.sliced(arguments); var promise = Promise.join( " + codeForInjects + " function() { var args = utils.sliced(arguments).concat(otherArgs); return " + codeForInvoke + "; } );";
};
