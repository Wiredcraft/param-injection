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
 * A variation that returns the context or `this`.
 *
 * Can be used to build some callback based APIs.
 *
 * However note that the dependencies are still promise based.
 */

module.exports = injectify = function() {
  var body, context, fn, injectified, params;
  fn = arguments[0], context = arguments[1], params = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  context = utils.validateContext(context, params);
  body = "return function injectified() { " + (params.length < 1 ? bodyWithoutParams(fn, context) : bodyWithParams(fn, context, params)) + " return " + (context ? 'context' : 'this') + "; }";
  injectified = new Function('Promise', 'utils', 'fn', 'context', body)(Promise, utils, fn, context);
  injectified.__parameters__ = params;
  injectified.__injections__ = new Array(params.length);
  injectified.inject = methodInject;
  return injectified;
};
