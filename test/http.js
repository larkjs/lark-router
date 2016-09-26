/**
 * Test the simple use of lark-router
 **/
'use strict';

const debug   = require('debug')('lark-router.test.simple');
const request = require('supertest');

const app     = require('../examples/http');

debug('loading ...');

describe('route simple path for http apps', () => {
    it('should response 200 for GET /welcome, route as GET /welcome', done => {
        request(app).get('/welcome?foo=bar')
            .expect(200, 'You are welcome!\n')
            .end(done);
    });

    it('should response 200 for GET /hello/world, route as GET /hello/world', done => {
        request(app).get('/hello/world')
            .expect(200, 'Hello World!\n')
            .end(done);
    }); 

    it('should response 200 for GET /home/123, route as GET /^\/home\/\d+$ (regexp)', done => {
        request(app).get('/home/123')
            .expect(200, 'Welcome home, No.123\n')
            .end(done);
    });

    it('should response 200 for GET /home/sunhaohao, route as GET /home/:name', done => {
        request(app).get('/home/sunhaohao')
            .expect(200, 'Welcome home, sunhaohao\n')
            .end(done);
    });

    it('should response 200 for GET /home/Ada%20Wong, route as GET /home/:name', done => {
        request(app).get('/home/Ada%20Wong')
            .expect(200, 'Welcome home, Ada Wong\n')
            .end(done);
    });

    it('should response 200 for GET /home/sunhaohao/brief-introduction-to-node.js, route as GET /home/:name/:page', done => {
        request(app).get('/home/sunhaohao/brief-introduction-to-node.js')
            .expect(200, 'Welcome to page <brief-introduction-to-node.js> by sunhaohao\n')
            .end(done);
    });

    it('should response 200 for POST /home/sunhaohao/brief-introduction-to-javascript, route as POST /home/:name/:page', done => {
        request(app).post('/home/sunhaohao/brief-introduction-to-javascript')
            .expect(200, 'Thank you for posting page <brief-introduction-to-javascript>, sunhaohao\n')
            .end(done);
    });

    it('should response 500 for GET /crash, route as GET /crash, which throws an Error', done => {
        request(app).get('/crash')
            .expect(500, 'Internal Error!\n')
            .end(done);
    });

    it('should response 404 for GET /unknown/path, routed as OTHER *, which responses for every unrouted request', done => {
        request(app).get('/unknown/path')
            .expect(404, 'Not Found\n')
            .end(done);
    });

    it('should clear router for GET /clear, after that all routing rules are discard', done => {
        request(app).get('/clear')
            .expect(200, 'cleared!\n')
            .end(() => {
                request(app).get('/welcome')
                    .end(() => {
                        (true).should.not.be.ok;
                    });
                setTimeout(done, 10);
            });
    });
});

debug('loaded!');
