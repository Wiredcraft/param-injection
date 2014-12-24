// var debug = require('debug')('carcass:test');

var Promise = require('bluebird');

var injectify = require('../').returnAuto;

describe('Variation that returns either the promise or self:', function() {

    describe('Use with a function that calls a callback:', function() {

        var obj = {};

        function func(lorem, callback) {
            setTimeout(function() {
                obj.invoked++;
                callback(null, lorem);
            }, 1);
        }

        it('can build a wrapper', function() {
            obj.wrapper = injectify(func);
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper('lorem', function(err, res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem');
                done(err);
            }).should.equal(obj);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('ipsum', function(err, res) {
                obj.invoked.should.equal(2);
                res.should.equal('ipsum');
                done(err);
            }).should.equal(obj);
        });

        it('can build a wrapper and inject', function() {
            obj.wrapper = injectify(func, 'lorem').inject('lorem', function() {
                return 'lorem ipsum';
            });
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper(function(err, res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem ipsum');
                done(err);
            }).should.equal(obj);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper(function(err, res) {
                obj.invoked.should.equal(2);
                res.should.equal('lorem ipsum');
                done(err);
            }).should.equal(obj);
        });

    });

    describe('Use with a function that returns a promise:', function() {

        var obj = {};

        function func(lorem) {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    obj.invoked++;
                    resolve(lorem);
                }, 1);
            });
        }

        it('can build a wrapper', function() {
            obj.wrapper = injectify(func);
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper('lorem').then(function(res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('ipsum').then(function(res) {
                obj.invoked.should.equal(2);
                res.should.equal('ipsum');
            }).then(done, done);
        });

        it('can build a wrapper and inject', function() {
            obj.wrapper = injectify(func, 'lorem').inject('lorem', function() {
                return 'lorem ipsum';
            });
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper().then(function(res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem ipsum');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper().then(function(res) {
                obj.invoked.should.equal(2);
                res.should.equal('lorem ipsum');
            }).then(done, done);
        });

    });

    describe('Use with a function that does both:', function() {

        var obj = {};

        function func(lorem, callback) {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    obj.invoked++;
                    resolve(lorem);
                    if (callback) callback(null, lorem);
                }, 1);
            });
        }

        it('can build a wrapper', function() {
            obj.wrapper = injectify(func);
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper('lorem').then(function(res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('ipsum').then(function(res) {
                obj.invoked.should.equal(2);
                res.should.equal('ipsum');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper('lorem', function(err, res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem');
                done(err);
            }).should.equal(obj);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper('ipsum', function(err, res) {
                obj.invoked.should.equal(2);
                res.should.equal('ipsum');
                done(err);
            }).should.equal(obj);
        });

        it('can build a wrapper and inject', function() {
            obj.wrapper = injectify(func, 'lorem').inject('lorem', function() {
                return 'lorem ipsum';
            });
            obj.wrapper.should.be.type('function');
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper().then(function(res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem ipsum');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper().then(function(res) {
                obj.invoked.should.equal(2);
                res.should.equal('lorem ipsum');
            }).then(done, done);
        });

        it('can run the wrapper', function(done) {
            obj.invoked = 0;
            obj.wrapper(function(err, res) {
                obj.invoked.should.equal(1);
                res.should.equal('lorem ipsum');
                done(err);
            }).should.equal(obj);
        });

        it('can run the wrapper', function(done) {
            obj.wrapper(function(err, res) {
                obj.invoked.should.equal(2);
                res.should.equal('lorem ipsum');
                done(err);
            }).should.equal(obj);
        });

    });

});
