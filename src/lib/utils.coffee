util = require('util')
bluebirdUtil = require('bluebird/js/main/util')

# Copied from bluebird.
generatePropertyAccess = (key) ->
    if bluebirdUtil.isIdentifier(key)
        return '.' + key
    else
        return "['" + key.replace(/(['\\])/g, '\\$1') + "']"

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
    sliced: {
        value: require('sliced')
    }
})
