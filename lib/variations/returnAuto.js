var Promise, bodies, bodyWithParams, bodyWithoutParams, debug, injectify, methodInject, methods, utils,
  __slice = [].slice;

debug = require('debug')('carcass:paramInjection');

Promise = require('bluebird');

utils = require('../utils');

methods = require('../methods');

methodInject = methods.inject;

bodies = require('../bodies');

bodyWithParams = bodies.withParams;

bodyWithoutParams = bodies.withoutParams;


/**
 * A variation that returns either the promise or the context, depends on if a
 *   callback function is given.
 *
 * Can be used to build something with both a promise API and a callback API.
 *
 * However note that 1) the dependencies are still promise based and 2) the last
 *   argument is considered as a callback if it is a function and 3) we assume the
 *   callback will be properly handled.
 */

module.exports = injectify = function() {
  var body, context, fn, injectified, params;
  fn = arguments[0], context = arguments[1], params = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  context = utils.validateContext(context, params);
  body = "return function injectified() { " + (params.length < 1 ? bodyWithoutParams(fn, context) : bodyWithParams(fn, context, params)) + " if (1 <= arguments.length && typeof arguments[arguments.length-1] === 'function') { return " + (context ? 'context' : 'this') + "; } else { return promise; } }";
  injectified = new Function('Promise', 'utils', 'fn', 'context', body)(Promise, utils, fn, context);
  injectified.__parameters__ = params;
  injectified.__injections__ = new Array(params.length);
  injectified.inject = methodInject;
  return injectified;
};
