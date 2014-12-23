// var debug = require('debug')('carcass:test');

var should = require('should');
var request = require('request');
var Promise = require('bluebird');

var injectify = require('../');

describe.skip('Example:', function() {

    it('should work', function(done) {

        // A function uses some parameters and returns something.
        function requestSomething(url, other, args) {
            return new Promise(function(resolve, reject) {
                request(url, function(err, res) {
                    if (err) return reject(err);
                    resolve(res);
                });
            });
        }

        // The URL is built in an asynchronous way.
        function getUrl() {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve('http://www.google.com');
                }, 10);
            });
        }

        // Wrap the function.
        var myRequest = injectify(requestSomething, 'url');

        // Inject the parameter.
        myRequest.inject('url', getUrl);

        // Run it.
        myRequest('other', 'args').then(function(res) {
            // debug('res', res);
            res.should.be.type('object');
            res.should.have.property('statusCode', 200);
        }).then(done, done);

    });

});
