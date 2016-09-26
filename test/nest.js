/**
 * Test the simple use of nesting 
 **/
'use strict';

const debug   = require('debug')('lark-router.test.nesting');
const request = require('supertest');

const app     = require('../examples/nest');

debug('loading ...');

describe('route mounted path for http apps', () => {
    it('should response 200 for GET /api/v2/foo/bar, route as GET /api/:version/:subroutine* -> GET /foo/:content', done => {
        request(app).get('/api/v2/foo/bar')
            .expect(200, '/foo/:content matched, content is bar\n')
            .end(done);
    });

    it('should response 200 for GET /api/v2, route as GET /api/:version/:subroutine* -> GET /', done => {
        request(app).get('/api/v2')
            .expect(200, '/ matched, content is undefined\n')
            .end(done);
    });

    it('should response 200 for GET /api/v2/bar/foo, route as GET /api/:version/:subroutine* -> GET /bar/:content', done => {
        request(app).get('/api/v2/bar/foo')
            .expect(200, '/bar/:content matched, content is foo\n')
            .end(done);
    });

    it('should response 200 for GET /api/v2/welcome/haohao/home, route as GET /api/:version/:subroutine* -> GET /welcome/:api_sub*/home -> GET /:content', done => {
        request(app).get('/api/v2/welcome/haohao/home')
            .expect(200, 'Welcome Haohao matched, content is haohao\n')
            .end(done);
    });

    it('should response 200 for GET /api/v2/welcome/haohao/home, route as GET /api/:version/:subroutine* -> GET /welcome/:api_sub*/home -> POST /:content', done => {
        request(app).post('/api/v2/welcome/haohao/home')
            .expect(200, '* matched, content is undefined\n')
            .end(done);
    });

    it('should response 500 for GET /api/v2/error/whatever, route as GET /api/:version/:subroutine* -> GET /error/:api_sub* -> ALL *', done => {
        request(app).get('/api/v2/error/whatever')
            .expect(500, 'Internal Error: Faked Error!')
            .end(done);
    });
});

debug('loaded!');
