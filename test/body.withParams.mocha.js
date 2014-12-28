// var debug = require('debug')('carcass:test');

var should = require('should');
var Promise = require('bluebird');

var injectify = require('../');

function noop() {}

function dep() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve('dependency');
        }, 1);
    });
}

describe('Injectify with params:', function() {

    describe('Use with something wrong:', function() {

        it('should throw', function() {
            (function() {
                injectify(null, 'whatever');
            }).should.throwError('object can not be injectified');
        });

        it('should throw', function() {
            (function() {
                injectify(true, 'whatever');
            }).should.throwError('boolean can not be injectified');
        });

        it('should throw', function() {
            (function() {
                injectify(1, 'whatever');
            }).should.throwError('number can not be injectified');
        });

        // TODO: more.

    });

    describe('Use with a function:', function() {

        describe('A simple function:', function() {

            var wrapper, wrapperInvoked;

            function func() {
                wrapperInvoked++;
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func, 'whatever');
                wrapper.should.be.type('function');
            });

            it('cannot run the wrapper without the injection', function(done) {
                wrapper().then(function() {
                    should.fail('expected an error');
                }, function(err) {
                    err.should.be.instanceOf(Error);
                    err.should.have.property('message', 'missing an injection');
                }).then(done, done);
            });

            it('cannot inject with a wrong type', function() {
                (function() {
                    wrapper.inject();
                }).should.throwError('name must be a string');
            });

            it('cannot inject with a wrong name', function() {
                (function() {
                    wrapper.inject('wrong', dep);
                }).should.throwError('there is not a parameter defined with the name');
            });

            it('cannot inject with a wrong getter', function() {
                (function() {
                    wrapper.inject('whatever');
                }).should.throwError('undefined can not be used as a parameter getter');
            });

            it('can inject', function() {
                wrapper.inject('whatever', dep);
            });

            it('can run the wrapper', function(done) {
                wrapperInvoked = 0;
                wrapper().then(function() {
                    wrapperInvoked.should.equal(1);
                }).then(done, done);
            });

            it('can run the wrapper', function(done) {
                wrapper().then(function() {
                    wrapperInvoked.should.equal(2);
                }).then(done, done);
            });

        });

        describe('A function that returns something:', function() {

            var wrapper;

            function func(dep) {
                return dep + ' lorem';
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func, 'whatever');
                wrapper.should.be.type('function');
            });

            it('can inject', function() {
                wrapper.inject('whatever', dep);
            });

            it('can run the wrapper', function(done) {
                wrapper().then(function(res) {
                    res.should.equal('dependency lorem');
                }).then(done, done);
            });

        });

        describe('A function that returns a promise:', function() {

            var wrapper;

            function func(dep) {
                return Promise.resolve(dep + ' lorem');
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func, 'whatever');
                wrapper.should.be.type('function');
            });

            it('can inject', function() {
                wrapper.inject('whatever', dep);
            });

            it('can run the wrapper', function(done) {
                wrapper().then(function(res) {
                    res.should.equal('dependency lorem');
                }).then(done, done);
            });

        });

        describe('A function that uses arguments:', function() {

            var wrapper, lorem;

            function func(dep, arg) {
                lorem = dep + ' ' + arg;
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func, 'whatever');
                wrapper.should.be.type('function');
            });

            it('can inject', function() {
                wrapper.inject('whatever', dep);
            });

            it('can run the wrapper', function(done) {
                lorem = null;
                wrapper('lorem').then(function() {
                    lorem.should.equal('dependency lorem');
                }).then(done, done);
            });

        });

        describe('A function that uses arguments and returns:', function() {

            var wrapper;

            function func(dep, arg) {
                return dep + ' ' + arg;
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func, 'whatever');
                wrapper.should.be.type('function');
            });

            it('can inject', function() {
                wrapper.inject('whatever', dep);
            });

            it('can run the wrapper', function(done) {
                wrapper('lorem').then(function(res) {
                    res.should.equal('dependency lorem');
                }).then(done, done);
            });

        });

    });

    describe('Build a wrapper for a method:', function() {

        var wrapper;

        var obj = {
            result: null,
            func: function(dep, arg) {
                this.result = dep + ' ' + arg;
            }
        };

        it('can build a wrapper', function() {
            wrapper = injectify('func', 'whatever');
            wrapper.should.be.type('function');
        });

        it('can inject', function() {
            wrapper.inject('whatever', dep);
        });

        it('can run the wrapper', function(done) {
            wrapper.call(obj, 'lorem').then(function() {
                obj.result.should.equal('dependency lorem');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            wrapper.call(obj, 'ipsum').then(function() {
                obj.result.should.equal('dependency ipsum');
            }).then(done, done);
        });

    });

    describe('Build a wrapper for a method (different syntax):', function() {

        var wrapper;

        var obj = {
            result: null,
            func: function(dep, arg) {
                this.result = dep + ' ' + arg;
            }
        };

        it('can build a wrapper', function() {
            wrapper = injectify(obj.func, 'whatever');
            wrapper.should.be.type('function');
        });

        it('can inject', function() {
            wrapper.inject('whatever', dep);
        });

        it('can run the wrapper', function(done) {
            wrapper.call(obj, 'lorem').then(function() {
                obj.result.should.equal('dependency lorem');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            wrapper.call(obj, 'ipsum').then(function() {
                obj.result.should.equal('dependency ipsum');
            }).then(done, done);
        });

    });

    describe('Build a wrapper for a method and use with a same context:', function() {

        var obj = {
            result: null,
            func: function(dep, arg) {
                this.result = dep + ' ' + arg;
            }
        };

        it('can build a wrapper', function() {
            obj.wrapper = injectify('func', 'whatever');
            obj.wrapper.should.be.type('function');
        });

        it('can inject', function() {
            obj.wrapper.inject('whatever', dep);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('lorem').then(function() {
                obj.result.should.equal('dependency lorem');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('ipsum').then(function() {
                obj.result.should.equal('dependency ipsum');
            }).then(done, done);
        });

    });

    describe('Build a wrapper as a method:', function() {

        var obj = {
            result: null
        };

        it('can build a wrapper', function() {
            obj.wrapper = injectify(function(dep, arg) {
                this.result = dep + ' ' + arg;
            }, 'whatever');
            obj.wrapper.should.be.type('function');
        });

        it('can inject', function() {
            obj.wrapper.inject('whatever', dep);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('lorem').then(function() {
                obj.result.should.equal('dependency lorem');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('ipsum').then(function() {
                obj.result.should.equal('dependency ipsum');
            }).then(done, done);
        });

    });

});
