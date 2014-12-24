debug = require('debug')('carcass:paramInjection')

Promise = require('bluebird')
utils = require('./utils')

methods = require('./methods')
methodInject = methods.inject

bodies = require('./bodies')
bodyWithParams = bodies.withParams
bodyWithoutParams = bodies.withoutParams

###*
 * Wraps a function so that one or some of the parameters can be auto-loaded at
 *   run time. Mainly used to build modules or functions that may have some run
 *   time dependencies.
 *
 * @param  {Function|String} fn the function to be wrapped
 * @param  {Object} context can be used to force the run time `this`
 * @param  {String} ...params names for each of the parameters that will be extracted
 *
 * @return {Function} the wrapper
###
module.exports = injectify = (fn, context, params...) ->
    # Validate context.
    context = utils.validateContext(context, params)

    # Build body. Copied idea from bluebird - we first build a function with a
    # dynamically generated body, and then use the function to get the wrapper.
    body = "
        return function injectified() {
            #{
                if params.length < 1 then bodyWithoutParams(fn, context)
                else bodyWithParams(fn, context, params)
            }
            return promise;
        }
        "
    # debug('body', body)

    # Build and run the function.
    injectified = new Function('Promise', 'utils', 'fn', 'context', body)(Promise, utils, fn, context)

    # Name for each of the parameters.
    injectified.__parameters__ = params

    # Value for each of the parameters.
    injectified.__injections__ = new Array(params.length)

    # Method.
    injectified.inject = methodInject

    return injectified
