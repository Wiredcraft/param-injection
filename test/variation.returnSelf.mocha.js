// var debug = require('debug')('carcass:test');

var injectify = require('../').returnSelf;

describe('Variation that returns self:', function() {

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

});
