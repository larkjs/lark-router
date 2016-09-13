/**
 * Test the async executes
 **/
'use strict';

const debug   = require('debug')('lark-router.test.async');
const request = require('supertest');

const app     = require('../examples/async');

debug('loading ...');

describe('route path for async http apps', () => {
    it('should response 200 for get /foo in 1.5s', done => {
        const startTime = Date.now();
        request(app).get('/foo')
            .expect(200)
            .end((err, res) => {
                const endTime = Date.now();
                res.text.should.be.an.instanceof(String);
                const timestamps = res.text.split(',').map(str => parseInt(str.trim(), 10));
                (Math.abs(timestamps[0] - startTime) <= 100).should.be.ok;
                (Math.abs(timestamps[1] - timestamps[0] - 1000) <= 100).should.be.ok;
                (Math.abs(timestamps[2] - timestamps[1] - 500) <= 100).should.be.ok;
                (Math.abs(endTime - timestamps[2]) <= 100).should.be.ok;
                done();
            });
    });
    it('should response 200 for get /bar in 1.5s', done => {
        const startTime = Date.now();
        request(app).get('/bar')
            .expect(200)
            .end((err, res) => {
                const endTime = Date.now();
                res.text.should.be.an.instanceof(String);
                const timestamps = res.text.split(',').map(str => parseInt(str.trim(), 10));
                (Math.abs(timestamps[0] - startTime - 500) <= 100).should.be.ok;
                (Math.abs(timestamps[1] - timestamps[0]) <= 100).should.be.ok;
                (Math.abs(timestamps[2] - timestamps[1] - 1000) <= 100).should.be.ok;
                (Math.abs(endTime - timestamps[2]) <= 100).should.be.ok;
                done();
            });
    });
});

debug('loaded!');
