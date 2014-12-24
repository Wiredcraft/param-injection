debug = require('debug')('carcass:paramInjection')

Promise = require('bluebird')
utils = require('../utils')

methods = require('../methods')
methodInject = methods.inject

bodies = require('../bodies')
bodyWithParams = bodies.withParams
bodyWithoutParams = bodies.withoutParams

###*
 * A variation that returns the context or `this`.
 *
 * Can be used to build some callback based APIs.
 *
 * However note that the dependencies are still promise based.
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
            return #{
                if context then 'context' else 'this'
            };
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
