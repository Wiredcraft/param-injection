var injectify;

module.exports = injectify = require('./lib/injectify');

injectify.utils = require('./lib/utils');

injectify.bodies = require('./lib/bodies');

injectify.methods = require('./lib/methods');

injectify.returnSelf = require('./lib/variations/returnSelf');

injectify.returnAuto = require('./lib/variations/returnAuto');
