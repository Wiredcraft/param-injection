module.exports = injectify = require('./lib/injectify')

# Exports the internals.
injectify.utils = require('./lib/utils')
injectify.bodies = require('./lib/bodies')
injectify.methods = require('./lib/methods')

# Variations.
injectify.returnSelf = require('./lib/variations/returnSelf')
