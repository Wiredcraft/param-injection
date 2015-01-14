var Promise, bodyWithParams, bodyWithoutParams, injectify, lib, methodInject, utils,
  __slice = [].slice;

Promise = require('bluebird');

lib = require('./index');

utils = lib.utils;

methodInject = lib.methods.inject;

bodyWithParams = lib.bodies.withParams;

bodyWithoutParams = lib.bodies.withoutParams;


/**
 * A variant that returns `this`.
 *
 * Can be used to build some callback based APIs.
 *
 * However note that the dependencies are still promise based.
 */

module.exports = injectify = function() {
  var body, fn, injectified, params;
  fn = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  body = "return function injectified() { " + (params.length < 1 ? bodyWithoutParams(fn) : bodyWithParams(fn, params)) + " return this; }";
  injectified = new Function('Promise', 'utils', 'fn', body)(Promise, utils, fn);
  injectified.__parameters__ = params;
  injectified.__injections__ = new Array(params.length);
  injectified.inject = methodInject;
  return injectified;
};
