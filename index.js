var Register, injectify, mixable, path;

module.exports = injectify = require('./lib/injectify');

path = require('path');

mixable = require('mixable-object');

Register = require('file-register');

mixable(injectify);

injectify.mixin(Register.proto);

injectify.register(path.resolve(__dirname, 'lib'));
