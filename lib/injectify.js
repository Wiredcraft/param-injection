var Promise, bodyWithParams, bodyWithoutParams, injectify, lib, methodInject, utils,
  __slice = [].slice;

Promise = require('bluebird');

lib = require('./index');

utils = lib.utils;

methodInject = lib.methods.inject;

bodyWithParams = lib.bodies.withParams;

bodyWithoutParams = lib.bodies.withoutParams;


/**
 * Wraps a function so that one or some of the parameters can be auto-loaded at
 *   run time. Mainly used to build modules or functions that may have some run
 *   time dependencies.
 *
 * @param  {Function|String} fn the function to be wrapped
 * @param  {String} ...params names for each of the parameters that will be extracted
 *
 * @return {Function} the wrapper
 */

module.exports = injectify = function() {
  var body, fn, injectified, params;
  fn = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  body = "return function injectified() { " + (params.length < 1 ? bodyWithoutParams(fn) : bodyWithParams(fn, params)) + " return promise; }";
  injectified = new Function('Promise', 'utils', 'fn', body)(Promise, utils, fn);
  injectified.__parameters__ = params;
  injectified.__injections__ = new Array(params.length);
  injectified.inject = methodInject;
  return injectified;
};
