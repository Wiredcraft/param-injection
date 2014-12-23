utils = require('./utils')

###*
 * Inject a getter for a parameter.
 *
 * @param {String} name the identifier, used to match a parameter position
 * @param {Function|String} getter the source, used to get or build the parameter
 * @param {Mixed} context can be used to force `this` for the getter
 * @param {Mixed} ...args all the arguments that will be passed to the getter
 *
 * @return {this}
###
module.exports = inject = (name, getter, context, args...) ->
    # Bad name.
    if typeof name isnt 'string'
        throw new TypeError('name must be a string')
    index = @__parameters__.indexOf(name)
    # Not found.
    if index < 0
        throw new Error('there is not a parameter defined with the name')
    # Wrap getter.
    if typeof getter is 'function'
        if utils.isObject(context)
            @__injections__[index] = ->
                return getter.apply(context, args)
        else
            @__injections__[index] = ->
                return getter.apply(@, args)
    else if typeof getter is 'string'
        if utils.isObject(context)
            @__injections__[index] = ->
                return context[getter].apply(context, args)
        else
            @__injections__[index] = ->
                return @[getter].apply(@, args)
    else
        throw new TypeError(utils.format('%s can not be used as a parameter getter', typeof getter))
    return @
