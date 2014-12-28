# debug = require('debug')('carcass:paramInjection')

utils = require('../utils')

###*
 * .
###
module.exports = withoutParams = (fn) ->
    # Build code that invokes the function.
    if typeof fn is 'function'
        codeForInvoke = 'fn.apply(this, arguments)'
    else if typeof fn is 'string'
        codeForInvoke = "this#{ utils.generatePropertyAccess(fn) }.apply(this, arguments)"
    else
        throw new TypeError(utils.format('%s can not be injectified', typeof fn))

    # Build body.
    return "var promise = Promise.resolve(#{ codeForInvoke });"
