debug = require('debug')('carcass:paramInjection')

Promise = require('bluebird')
utils = require('../utils')

methods = require('../methods')
methodInject = methods.inject

bodies = require('../bodies')
bodyWithParams = bodies.withParams
bodyWithoutParams = bodies.withoutParams

###*
 * A variation that returns either the promise or the context, depends on if a
 *   callback function is given.
 *
 * Can be used to build something with both a promise API and a callback API.
 *
 * However note that 1) the dependencies are still promise based and 2) the last
 *   argument is considered as a callback if it is a function and 3) we assume the
 *   callback will be properly handled.
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
            if (1 <= arguments.length && typeof arguments[arguments.length-1] === 'function') {
                return #{
                    if context then 'context' else 'this'
                };
            } else {
                return promise;
            }
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
