# debug = require('debug')('carcass:paramInjection')

Promise = require('bluebird')

lib = require('./index')
utils = lib.utils
methodInject = lib.methods.inject
bodyWithParams = lib.bodies.withParams
bodyWithoutParams = lib.bodies.withoutParams

###*
 * A variant that returns `this`.
 *
 * Can be used to build some callback based APIs.
 *
 * However note that the dependencies are still promise based.
###
module.exports = injectify = (fn, params...) ->
    # Build body. Copied idea from bluebird - we first build a function with a
    # dynamically generated body, and then use the function to get the wrapper.
    body = "
        return function injectified() {
            #{
                if params.length < 1 then bodyWithoutParams(fn)
                else bodyWithParams(fn, params)
            }
            return this;
        }
        "
    # debug('body', body)

    # Build and run the function.
    injectified = new Function('Promise', 'utils', 'fn', body)(Promise, utils, fn)

    # Name for each of the parameters.
    injectified.__parameters__ = params

    # Value for each of the parameters.
    injectified.__injections__ = new Array(params.length)

    # Method.
    injectified.inject = methodInject

    return injectified
