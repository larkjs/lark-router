/**
 * Test the use in Koa@v2
 **/
'use strict';

const debug   = require('debug')('lark-router.test.koa');
const http    = require('http');
const request = require('supertest');

const app     = require('../examples/koa');

debug('loading ...');

describe('route path for koa apps', () => {
    it('should response 200 for GET /home/sunhaohao, route as GET /home/:name', done => {
        request(app).get('/home/sunhaohao')
            .expect(200, 'Welcome home, sunhaohao\n')
            .end(done);
    });
});

debug('loaded!');
