/**
 * Test loading directories as routers
 **/
'use strict';

const debug   = require('debug')('lark-router.test.load_directories');
const request = require('supertest');

const app     = require('../examples/load_directories/app');

describe('route with directories for koa apps', () => {
    it('should response 200 for GET /hello, route as ALL /hello -> GET /', done => {
        request(app).get('/hello')
            .expect(200, 'Hello, How are you?\n')
            .end(done);
    });

    it('should response 200 for POST /hello, route as ALL /hello -> POST /', done => {
        request(app).post('/hello')
            .expect(200, 'Hello, Thank you for your postings\n')
            .end(done);
    });

    it('should response 200 for DELETE /hello, route as ALL /hello -> OTHER /', done => {
        request(app).delete('/hello')
            .expect(200, 'Hello, What can I do for you?\n')
            .end(done);
    });

    it('should response 200 for GET /foo/bar, route as ALL /foo -> ALL /bar -> GET /', done => {
        request(app).get('/foo/bar')
            .expect(200, 'Foo Bar\n')
            .end(done);
    });

    it('should response 200 for GET /, route as ALL / -> GET /', done => {
        request(app).get('/')
            .expect(200, 'main')
            .end(done);
    });

    it('should response 200 for GET /home/haohao, route as ALL /home -> GET /:name', done => {
        request(app).get('/home/haohao')
            .expect(200, 'Welcome home, haohao\n')
            .end(done);
    });

    it('should response 200 for get /api/foo/bar, route as ALL /api -> get /:path*', done => {
        request(app).get('/api/foo/bar')
            .expect(200, 'You have requested api foo/bar\n')
            .end(done);
    });

    it('should response 404 for get /unknown, routed as ALL * as default router', done => {
        request(app).get('/unknown')
            .expect(404, 'Not Found')
            .end(done);
    });

    it('should response 500 fro get /error, routed as ALL /error -> GET /', done => {
        request(app).get('/error')
            .expect(500, 'Internal Server Error')
            .end(done);
    });
});
