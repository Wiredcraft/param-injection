# debug = require('debug')('carcass:paramInjection')

utils = require('./utils')

###*
 * .
###
module.exports = withParams = (fn, context, params) ->
    # Build code that invokes the function.
    if typeof fn is 'function'
        if context
            codeForInvoke = 'fn.apply(context, args)'
        else
            codeForInvoke = 'fn.apply(self, args)'
    else if typeof fn is 'string'
        if context
            codeForInvoke = "context#{ utils.generatePropertyAccess(fn) }.apply(context, args)"
        else
            codeForInvoke = "self#{ utils.generatePropertyAccess(fn) }.apply(self, args)"
    else
        throw new TypeError(utils.format('%s can not be injectified', typeof fn))

    # Build code that validates all the injections.
    codeForValidates = ''
    params.forEach((name, index) ->
        # TODO:
        # Parameter names must be identifiers.
        # Must have been injected.
        # TODO: a default injection?
        codeForValidates += "
            if (typeof injects[#{ index }] !== 'function') {
                return Promise.reject(new Error('missing an injection'));
            }
            "
    )

    # Build code that invokes every injection.
    codeForInjects = ''
    if context
        params.forEach((name, index) ->
            codeForInjects += "injects[#{ index }].call(context), "
        )
    else
        params.forEach((name, index) ->
            codeForInjects += "injects[#{ index }].call(self), "
        )

    # Build body.
    return "
        var injects = injectified.__injections__;
        #{ codeForValidates }
        var self = this;
        var otherArgs = utils.sliced(arguments);
        var promise = Promise.join(
            #{ codeForInjects }
            function() {
                var args = utils.sliced(arguments).concat(otherArgs);
                return #{ codeForInvoke };
            }
        );
        "
