'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _app = require('../example/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('lark-router'); /**
                                                  * Test lark router
                                                  **/

var request = _supertest2.default.agent(_app2.default);

describe('lark-router request on static urls', function () {
    var _loop = function _loop(url) {
        it('should be ok on GET ' + url, function (done) {
            request.get(url).expect(200).expect('GET ' + url, done);
        });
    };

    var _arr = ['/', '/foo', '/foo/bar'];

    for (var _i = 0; _i < _arr.length; _i++) {
        var url = _arr[_i];
        _loop(url);
    };

    var _loop2 = function _loop2(url) {
        it('should be 404 on GET ' + url, function (done) {
            request.get(url).expect(404).expect('Not Found', done);
        });
    };

    var _arr2 = ['/not_exist', '/foo/not_exist'];
    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var url = _arr2[_i2];
        _loop2(url);
    };
});

describe('lark-router request on dynamic urls', function () {
    var _loop3 = function _loop3(url) {
        it('should be ok on GET ' + url, function (done) {
            request.get(url).expect(200).expect('GET /:id/me', done);
        });
    };

    var _arr3 = ['/123/me', '/456/me', '/whatever/me'];

    for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
        var url = _arr3[_i3];
        _loop3(url);
    }

    var _loop4 = function _loop4(url) {
        it('should be ok on GET ' + url, function (done) {
            request.get(url).expect(200).expect('GET /:name/home', done);
        });
    };

    var _arr4 = ['/lark/home', '/lark-router/home', '/viringbells/home'];
    for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
        var url = _arr4[_i4];
        _loop4(url);
    }

    var _loop5 = function _loop5(url) {
        it('should be ok on GET ' + url, function (done) {
            request.get(url).expect(200).expect('GET /:name/score/:subject', done);
        });
    };

    var _arr5 = ['/lark/score/cs', '/viringbells/score/tennis'];
    for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
        var url = _arr5[_i5];
        _loop5(url);
    }
});

describe('lark-router request with methods', function () {
    var url = '/methods';

    var _loop6 = function _loop6(method) {
        it('should be ok on ' + method + ' ' + url, function (done) {
            request[method.toLowerCase()](url).expect(200).expect(method + ' ' + url, done);
        });
    };

    var _arr6 = ['GET', 'POST', 'PUT', 'DELETE'];
    for (var _i6 = 0; _i6 < _arr6.length; _i6++) {
        var method = _arr6[_i6];
        _loop6(method);
    }
});

describe('lark-router request on urls redirects', function () {
    var url = '/foo/redirect';
    it('should redirect to /methods on /foo/redirect', function (done) {
        request.get(url).expect(301).expect('Location', '/methods', done);
    });
});

describe('lark-router request on cunstomized routes', function () {
    var method = 'GET';
    var url = '/hello/world';
    it('should be ok on ' + method + ' ' + url, function (done) {
        request[method.toLowerCase()](url).expect(200).expect(method + ' ' + url, done);
    });

    method = 'POST';
    url = '/hello/world/post';
    it('should be ok on ' + method + ' ' + url, function (done) {
        request[method.toLowerCase()](url).expect(200).expect(method + ' ' + url, done);
    });
});