'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

const debug = (0, _debug3.default)('lark-router');

exports.default = router => {
    debug("Example: add route GET /hello/world");
    router.get('/', (function () {
        var ref = _asyncToGenerator(function* (ctx) {
            debug("Example: GET /hello/world");
            ctx.body = 'GET /hello/world';
        });

        return function (_x) {
            return ref.apply(this, arguments);
        };
    })());

    debug("Example: add route POST /hello/world");
    router.post('/post', (function () {
        var ref = _asyncToGenerator(function* (ctx) {
            debug("Example: POST /hello/world/post");
            ctx.body = 'POST /hello/world/post';
        });

        return function (_x2) {
            return ref.apply(this, arguments);
        };
    })());
};