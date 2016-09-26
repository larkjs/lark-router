/**
 * Test loading directories as routers with config
 **/
'use strict';

const debug   = require('debug')('lark-router.test.load_with_config');
const request = require('supertest');

const app     = require('../examples/load_with_config/app');

describe('route with directories for koa apps', () => {
    it('should response 200 for GET /hello, route as ALL /hello -> GET /', done => {
        request(app).get('/hello')
            .expect(200, 'Hello')
            .end(done);
    });

    it('should response 200 for GET /welcome/haohao, route as ALL /welcome -> GET /:name (filename is Name.js) -> GET /', done => {
        request(app).get('/welcome/haohao')
            .expect(200, 'Hello, haohao')
            .end(done);
    });
});
