/**
 * Test for lark-router
 **/
'use strict';

const agent = require('supertest');
const methods = require('lark-router/src/methods');

const Router = require('lark-router');
const app = require('lark-router/example');
const httpApp = require('lark-router/example/http');

const request = agent(app);
const http = agent(httpApp);

describe('lark router app', () => {
    it('should response 404 for not found url', (done) => {
        request.get('/404/not/found')
            .expect(404)
            .end(done);
    });

    it('should response 200 for GET /hello/world', (done) => {
        request.get('/hello/world')
            .expect(200)
            .expect('Hello World!', done);
    });

    it('should response 200 for another method POST /how/are/you', (done) => {
        request.post('/how/are/you')
            .expect(200)
            .expect('Fine, thank you. And you ?', done);
    });

    it('should response 200 for another method DELETE /good/bye', (done) => {
        request.delete('/good/bye')
            .expect(200)
            .expect('Oh, see you tomorrow.', done);
    });

    it('should response 200 for using PARAMS get /my/name/is/Haohao', (done) => {
        request.get('/my/name/is/Haohao')
            .expect(200)
            .expect('Nice to meet you, Haohao', done);
    });

    it('should response 200 for using PARAMS as NUMBERS /what/is/the/answer/of/92/plus/-4', (done) => {
        request.get('/what/is/the/answer/of/92/plus/-4')
            .expect(200)
            .expect('The answer is 88', done);
    });

    it('should response 404 for using WRONG PARAMS as NUMBERS /what/is/the/answer/of/one/plus/two', (done) => {
        request.get('/what/is/the/answer/of/one/plus/two')
            .expect(404, done);
    });

    it('should response 200 for using REGEXP for GET /Vii/is/18', (done) => {
        request.get('/Vii/is/18')
            .expect(200)
            .expect('Vii is 18 years old', done);
    });

    it('should response 200 for NESTING ROUTES /he/is/18/and/she/is/18', (done) => {
        request.get('/he/is/18/and/she/is/18')
            .expect(200)
            .expect('The boy is the same age as the girl', done);
    });

    it('should response 200 for NESTING ROUTES /he/is/18/and/she/is/28', (done) => {
        request.get('/he/is/18/and/she/is/28')
            .expect(200)
            .expect('The boy is younger than the girl', done);
    });

    it('should response 200 for NESTING ROUTES /he/is/28/and/she/is/18', (done) => {
        request.get('/he/is/28/and/she/is/18')
            .expect(200)
            .expect('The boy is elder than the girl', done);
    });

    it('should response 200 marked as ROUTED for GET /foo/bar', (done) => {
        request.get('/foo/bar')
            .expect(200)
            .expect('[GET][MARKED AS ROUTED]', done);
    });

    it('should response 200 marked as NOT ROUTED for GET /foo/baz', (done) => {
        request.get('/foo/baz')
            .expect(200)
            .expect('[MARKED AS NOT ROUTED]', done);
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
