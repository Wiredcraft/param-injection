var utils, withParams;

utils = require('../utils');


/**
 * .
 */

module.exports = withParams = function(fn, params) {
  var codeForInjects, codeForInvoke, codeForValidates;
  if (typeof fn === 'function') {
    codeForInvoke = 'fn.apply(self, args)';
  } else if (typeof fn === 'string') {
    codeForInvoke = "self" + (utils.generatePropertyAccess(fn)) + ".apply(self, args)";
  } else {
    throw new TypeError(utils.format('%s can not be injectified', typeof fn));
  }
  codeForValidates = '';
  params.forEach(function(name, index) {
    return codeForValidates += "if (typeof injects[" + index + "] !== 'function') { return Promise.reject(new Error('missing an injection')); }";
  });
  codeForInjects = '';
  params.forEach(function(name, index) {
    return codeForInjects += "injects[" + index + "].call(self), ";
  });
  return "var injects = injectified.__injections__; " + codeForValidates + " var self = this; var otherArgs = utils.sliced(arguments); var promise = Promise.join( " + codeForInjects + " function() { var args = utils.sliced(arguments).concat(otherArgs); return " + codeForInvoke + "; } );";
};
