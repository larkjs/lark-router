/**
 * Test for lark-router
 **/
'use strict';

const agent = require('supertest');

const Router = require('..');
const app = require('../example/app');
const httpApp = require('../example/http');

const request = agent(app);
const http = agent(httpApp);

describe('lark router app', () => {
    it('should response 404 for not found url', (done) => {
        request.get('/404/not/found')
            .expect(404)
            .end(done);
    });

    it('should response 200 for get /home/haohao', (done) => {
        request.get('/home/haohao')
            .expect(200)
            .expect('Welcome home, haohao', done);
    });

    it('should response 200 for post /home/haohao/logout', (done) => {
        request.post('/home/haohao/logout')
            .expect(200)
            .expect('You have posted an action "logout" to haohao', done);
    });

    it('should response 200 for get /2/foo/bar', (done) => {
        request.get('/2/foo/bar')
            .expect(200)
            .expect('Foo - Bar = bar', done);
    });

    it('should response 200 for get /2/hello/foo/bar', (done) => {
        request.get('/2/hello/foo/bar')
            .expect(200)
            .expect('Foo - Bar = hello:bar', done);
    });

    it('should response 200 for get /welcome/haohao', (done) => {
        request.get('/welcome/haohao')
            .expect(200)
            .expect('Welcome, haohao [Routed][All]', done);
    });

    it('should response 200 for post /welcome/haohao', (done) => {
        request.post('/welcome/haohao')
            .expect(200)
            .expect('Not matched [All]', done);
    });

    it('should resposne 200 for get /regexp/1', (done) => {
        request.get('/regexp/1')
            .expect(200)
            .expect('input is 1', done);
    });

});

describe('start a router with undefined method', () => {
    it('should throw error', (done) => {
        const router = new Router();
        let error = {};
        try {
            router.test('/test', async (ctx, async) => {
            });
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceof(Error);
        done();
    });
});

describe('route with an http server', () => {
    it('should response 200 for get /hello//haohao', (done) => {
        http.get('/hello/haohao')
            .expect(200)
            .expect('Hello, haohao!', done);
    });
});
