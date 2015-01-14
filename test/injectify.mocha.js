// var debug = require('debug')('carcass:test');

var injectify = require('../');

describe('The injectify builder:', function() {

    it('should be a function', function() {
        injectify.should.be.type('function');
    });

    it('should have some tools exported', function() {
        injectify.should.have.property('utils').with.type('object');
        injectify.should.have.property('bodies').with.type('object');
        injectify.should.have.property('methods').with.type('object');
    });

    it('should have some variations exported', function() {
        injectify.should.have.property('returnSelf').with.type('function');
        injectify.should.have.property('returnAuto').with.type('function');
    });

});
