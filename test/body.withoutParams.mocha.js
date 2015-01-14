// var debug = require('debug')('carcass:test');

var Promise = require('bluebird');

var injectify = require('../');

describe('Injectify without params:', function() {

    describe('Use with something wrong:', function() {

        it('should throw', function() {
            (function() {
                injectify();
            }).should.throwError('undefined can not be injectified');
        });

        it('should throw', function() {
            (function() {
                injectify(null);
            }).should.throwError('object can not be injectified');
        });

        it('should throw', function() {
            (function() {
                injectify(true);
            }).should.throwError('boolean can not be injectified');
        });

        it('should throw', function() {
            (function() {
                injectify(1);
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
                wrapper = injectify(func);
                wrapper.should.be.type('function');
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

            function func() {
                return 'lorem';
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func);
                wrapper.should.be.type('function');
            });

            it('can run the wrapper', function(done) {
                wrapper().then(function(res) {
                    res.should.equal('lorem');
                }).then(done, done);
            });

        });

        describe('A function that returns a promise:', function() {

            var wrapper;

            function func() {
                return Promise.resolve('lorem');
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func);
                wrapper.should.be.type('function');
            });

            it('can run the wrapper', function(done) {
                wrapper().then(function(res) {
                    res.should.equal('lorem');
                }).then(done, done);
            });

        });

        describe('A function that uses arguments:', function() {

            var wrapper, lorem;

            function func(arg) {
                lorem = arg;
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func);
                wrapper.should.be.type('function');
            });

            it('can run the wrapper', function(done) {
                lorem = null;
                wrapper('lorem').then(function() {
                    lorem.should.equal('lorem');
                }).then(done, done);
            });

        });

        describe('A function that uses arguments and returns:', function() {

            var wrapper;

            function func(arg) {
                return arg;
            }

            it('can build a wrapper', function() {
                wrapper = injectify(func);
                wrapper.should.be.type('function');
            });

            it('can run the wrapper', function(done) {
                wrapper('lorem').then(function(res) {
                    res.should.equal('lorem');
                }).then(done, done);
            });

        });

    });

    describe('Build a wrapper for a method:', function() {

        var wrapper;

        var obj = {
            invoked: 0,
            func: function() {
                this.invoked++;
            }
        };

        it('can build a wrapper', function() {
            wrapper = injectify('func');
            wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            wrapper.call(obj).then(function() {
                obj.invoked.should.equal(1);
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            wrapper.call(obj).then(function() {
                obj.invoked.should.equal(2);
            }).then(done, done);
        });

    });

    describe('Build a wrapper for a method (different syntax):', function() {

        var wrapper;

        var obj = {
            invoked: 0,
            func: function() {
                this.invoked++;
            }
        };

        it('can build a wrapper', function() {
            wrapper = injectify(obj.func);
            wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            wrapper.call(obj).then(function() {
                obj.invoked.should.equal(1);
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            wrapper.call(obj).then(function() {
                obj.invoked.should.equal(2);
            }).then(done, done);
        });

    });

    describe('Build a wrapper for a method and use with a same context:', function() {

        var obj = {
            invoked: 0,
            func: function() {
                this.invoked++;
            }
        };

        it('can build a wrapper', function() {
            obj.wrapper = injectify('func');
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper().then(function() {
                obj.invoked.should.equal(1);
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper().then(function() {
                obj.invoked.should.equal(2);
            }).then(done, done);
        });

    });

    describe('Build a wrapper as a method:', function() {

        var obj = {
            invoked: 0
        };

        it('can build a wrapper', function() {
            obj.wrapper = injectify(function() {
                this.invoked++;
            });
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper().then(function() {
                obj.invoked.should.equal(1);
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper().then(function() {
                obj.invoked.should.equal(2);
            }).then(done, done);
        });

    });

});
