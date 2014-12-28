var debug = require('debug')('carcass:benchmark');

var Promise = require('bluebird');
var Benchmark = require('benchmark');

var injectify = require('../');
var wrapper;

function lorem(lorem) {
    return lorem;
}

// Simple function.
function func1() {
    return '1st';
}

// Returns a promise.
function func2() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('2nd');
        }, 1);
    });
}

// Benchmark
// ---
describe('Benchmarking:', function() {

    it('done', function(done) {
        Benchmark.options.maxTime = 1;
        var suite = Benchmark.Suite();
        suite.add('', function() {
            wrapper = injectify(lorem, 'lorem');
        });
        suite.on('start', function() {
            debug('build a wrapper with a simple function');
        }).on('cycle', function(event) {
            debug(String(event.target));
        }).on('complete', function() {
            done();
        }).run({
            'async': true
        });
    });

    it('done', function(done) {
        Benchmark.options.maxTime = 1;
        var suite = Benchmark.Suite();
        suite.add('', function() {
            wrapper.inject('lorem', func1);
        });
        suite.on('start', function() {
            debug('inject a parameter');
        }).on('cycle', function(event) {
            debug(String(event.target));
        }).on('complete', function() {
            done();
        }).run({
            'async': true
        });
    });

    it('done', function(done) {
        Benchmark.options.maxTime = 3;
        var suite = Benchmark.Suite();
        suite.add('with Promise.join()', function(deferred) {
            function resolve() {
                deferred.resolve();
            }
            Promise.join(func1(), function(res) {
                return lorem(res);
            }).then(resolve, resolve);
        }, {
            'defer': true
        });
        suite.add('with the wrapper', function(deferred) {
            function resolve() {
                deferred.resolve();
            }
            wrapper().then(resolve, resolve);
        }, {
            'defer': true
        });
        suite.on('start', function() {
            debug('run');
        }).on('cycle', function(event) {
            debug(String(event.target));
        }).on('complete', function() {
            done();
        }).run({
            'async': true
        });
    });

    it('done', function(done) {
        Benchmark.options.maxTime = 1;
        var suite = Benchmark.Suite();
        suite.add('', function() {
            wrapper.inject('lorem', func2);
        });
        suite.on('start', function() {
            debug('inject a parameter');
        }).on('cycle', function(event) {
            debug(String(event.target));
        }).on('complete', function() {
            done();
        }).run({
            'async': true
        });
    });

    it('done', function(done) {
        Benchmark.options.maxTime = 3;
        var suite = Benchmark.Suite();
        suite.add('using Promise.join()', function(deferred) {
            function resolve() {
                deferred.resolve();
            }
            Promise.join(func2(), function(res) {
                return lorem(res);
            }).then(resolve, resolve);
        }, {
            'defer': true
        });
        suite.add('using the wrapper', function(deferred) {
            function resolve() {
                deferred.resolve();
            }
            wrapper().then(resolve, resolve);
        }, {
            'defer': true
        });
        suite.on('start', function() {
            debug('run');
        }).on('cycle', function(event) {
            debug(String(event.target));
        }).on('complete', function() {
            done();
        }).run({
            'async': true
        });
    });

});
