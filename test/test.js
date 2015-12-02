/**
 * Test lark router
 **/
import _debug     from 'debug';
import KoaRouter  from 'koa-router';
import supertest  from 'supertest';
import Router     from '..';
import app        from '../example/app';

const debug   = _debug('lark-router');
const request = supertest.agent(app);

describe('lark-router request on static urls', () => {
    for (const url of ['/', '/foo', '/foo/bar']) {
        it('should be ok on GET ' + url, done => {
            request.get(url).expect(200).expect('GET ' + url, done);
        })
    };
    for (const url of ['/not_exist', '/foo/not_exist']) {
        it('should be 404 on GET ' + url, done => {
            request.get(url).expect(404).expect('Not Found', done);
        })
    };
});

describe('lark-router request on dynamic urls', () => {
    for (const url of ['/123/me', '/456/me', '/whatever/me']) {
        it('should be ok on GET ' + url, done => {
            request.get(url).expect(200).expect('GET /:id/me', done);
        });
    }
    for (const url of ['/lark/home', '/lark-router/home', '/viringbells/home']) {
        it('should be ok on GET ' + url, done => {
            request.get(url).expect(200).expect('GET /:name/home', done);
        });
    }
    for (const url of ['/lark/score/cs', '/viringbells/score/tennis']) {
        it('should be ok on GET ' + url, done => {
            request.get(url).expect(200).expect('GET /:name/score/:subject', done);
        });
    }
});

describe('lark-router request with methods', () => {
    const url = '/methods';
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
        it('should be ok on ' + method + ' ' + url, done => {
            request[method.toLowerCase()](url).expect(200).expect(method + ' ' + url, done);
        });
    }
});

describe('lark-router request on urls redirects', () => {
    const url = '/foo/redirect';
    it('should redirect to /methods on /foo/redirect', done => {
        request.get(url).expect(301).expect('Location', '/methods', done);
    });
});

describe('lark-router request on cunstomized routes', () => {
    let method = 'GET';
    let url = '/hello/world';
    it('should be ok on ' + method + ' ' + url, done => {
        request[method.toLowerCase()](url).expect(200).expect(method + ' ' + url, done);
    });

    method = 'POST';
    url = '/hello/world/post';
    it('should be ok on ' + method + ' ' + url, done => {
        request[method.toLowerCase()](url).expect(200).expect(method + ' ' + url, done);
    });
});
