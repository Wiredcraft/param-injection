# debug = require('debug')('carcass:paramInjection')

Promise = require('bluebird')

lib = require('./index')
utils = lib.utils
methodInject = lib.methods.inject
bodyWithParams = lib.bodies.withParams
bodyWithoutParams = lib.bodies.withoutParams

###*
 * A variant that returns either the promise or `this`, depending on if a callback
 *   function is given.
 *
 * Can be used to build something with both a promise API and a callback API.
 *
 * However note that 1) the dependencies are still promise based and 2) the last
 *   argument is considered as a callback if it is a function and 3) we assume the
 *   callback will be properly handled.
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
            if (1 <= arguments.length && typeof arguments[arguments.length-1] === 'function') {
                return this;
            } else {
                return promise;
            }
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
