# debug = require('debug')('carcass:paramInjection')

utils = require('../utils')

###*
 * .
###
module.exports = withoutParams = (fn, context) ->
    # Build code that invokes the function.
    if typeof fn is 'function'
        if context
            codeForInvoke = 'fn.apply(context, arguments)'
        else
            codeForInvoke = 'fn.apply(this, arguments)'
    else if typeof fn is 'string'
        if context
            codeForInvoke = "context#{ utils.generatePropertyAccess(fn) }.apply(context, arguments)"
        else
            codeForInvoke = "this#{ utils.generatePropertyAccess(fn) }.apply(this, arguments)"
    else
        throw new TypeError(utils.format('%s can not be injectified', typeof fn))

    # Build body.
    return "var promise = Promise.resolve(#{ codeForInvoke });"
