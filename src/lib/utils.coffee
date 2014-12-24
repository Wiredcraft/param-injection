util = require('util')
bluebirdUtil = require('bluebird/js/main/util')

# Copied from bluebird.
generatePropertyAccess = (key) ->
    if bluebirdUtil.isIdentifier(key)
        return '.' + key
    else
        return "['" + key.replace(/(['\\])/g, '\\$1') + "']"

###*
 * Validate context.
 *
 * Since context must be an object and the parameters must be strings, user can
 *   skip context.
###
validateContext = (context, params) ->
    if typeof context is 'string'
        params.unshift(context)
        return false
    else if not context?
        return false
    else if not bluebirdUtil.isObject(context)
        throw new TypeError(util.format('%s can not be used as a context or a parameter name', typeof context))
    return context

###*
 * Inherit from bluebird's util.
###
module.exports = Object.create(bluebirdUtil, {
    format: {
        value: util.format
    }
    generatePropertyAccess: {
        value: generatePropertyAccess
    }
    validateContext: {
        value: validateContext
    }
    sliced: {
        value: require('sliced')
    }
})
