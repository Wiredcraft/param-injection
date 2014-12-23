var inject, utils,
  __slice = [].slice;

utils = require('./utils');


/**
 * Inject a getter for a parameter.
 *
 * @param {String} name the identifier, used to match a parameter position
 * @param {Function|String} getter the source, used to get or build the parameter
 * @param {Mixed} context can be used to force `this` for the getter
 * @param {Mixed} ...args all the arguments that will be passed to the getter
 *
 * @return {this}
 */

module.exports = inject = function() {
  var args, context, getter, index, name;
  name = arguments[0], getter = arguments[1], context = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  if (typeof name !== 'string') {
    throw new TypeError('name must be a string');
  }
  index = this.__parameters__.indexOf(name);
  if (index < 0) {
    throw new Error('there is not a parameter defined with the name');
  }
  if (typeof getter === 'function') {
    if (utils.isObject(context)) {
      this.__injections__[index] = function() {
        return getter.apply(context, args);
      };
    } else {
      this.__injections__[index] = function() {
        return getter.apply(this, args);
      };
    }
  } else if (typeof getter === 'string') {
    if (utils.isObject(context)) {
      this.__injections__[index] = function() {
        return context[getter].apply(context, args);
      };
    } else {
      this.__injections__[index] = function() {
        return this[getter].apply(this, args);
      };
    }
  } else {
    throw new TypeError(utils.format('%s can not be used as a parameter getter', typeof getter));
  }
  return this;
};
