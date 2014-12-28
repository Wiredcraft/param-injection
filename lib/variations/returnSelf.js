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
 * A variation that returns `this`.
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
