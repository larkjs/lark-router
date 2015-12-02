'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('lark-router');

exports.default = function (router) {
    debug("Example: add route GET /hello/world");
    router.get('/', function* (next) {
        var ctx = this;
        debug("Example: GET /hello/world");
        ctx.body = 'GET /hello/world';
        yield next;
    });

    debug("Example: add route POST /hello/world");
    router.post('/post', function* (next) {
        var ctx = this;
        debug("Example: POST /hello/world/post");
        ctx.body = 'POST /hello/world/post';
        yield next;
    });
};