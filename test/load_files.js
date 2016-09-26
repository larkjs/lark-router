/**
 * Test loading files as routers
 **/
'use strict';

const debug   = require('debug')('lark-router.test.load_files');
const request = require('supertest');

const app     = require('../examples/load_files/app');

debug('loading ...');

describe('route file which is a function for koa apps', () => {
    it('should response 200 for GET /func, route as ALL /func -> GET /', done => {
        request(app).get('/func?foo=bar')
            .expect(200, 'func GET /\n')
            .end(done);
    });

    it('should response 200 for GET /func/welcome, route as ALL /func -> GET /welcome', done => {
        request(app).get('/func/welcome?foo=bar')
            .expect(200, 'func GET /welcome\n')
            .end(done);
    });

    it('should response 200 for GET /custom, route as ALL /custom -> GET /', done => {
        request(app).get('/custom?foo=bar')
            .expect(200, 'custom GET /\n')
            .end(done);
    });

    it('should response 200 for GET /custom/welcome, route as ALL /custom -> GET /welcome', done => {
        request(app).get('/custom/welcome')
            .expect(200, 'custom GET /welcome\n')
            .end(done);
    });
});

describe('route file which is a object for koa apps', () => {
    it('should response 200 for GET /obj, route as ALL /obj -> GET /', done => {
        request(app).get('/obj')
            .expect(200, 'obj GET /\n')
            .end(done);
    });

    it('should response 200 for POST /obj, route as ALL /obj -> POST /', done => {
        request(app).post('/obj')
            .expect(200, 'obj POST /\n')
            .end(done);
    });

    it('should response 500 for DELETE /obj, route as ALL /obj -> DELETE /', done => {
        request(app).delete('/obj')
            .expect(500, 'Internal Server Error')
            .end(done);
    });

    it('should response 404 for GET /404, route as not found, ctx.body is empty', done => {
        request(app).get('/404')
            .expect(404, 'Not Found')
            .end(done);
    });
});

debug('loaded!');
