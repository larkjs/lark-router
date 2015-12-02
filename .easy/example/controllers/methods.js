'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DELETE = exports.PUT = exports.POST = exports.GET = undefined;

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

const debug = (0, _debug3.default)('lark-router');

const GET = exports.GET = (function () {
    var ref = _asyncToGenerator(function* (ctx) {
        debug("Example: GET /methods");
        ctx.body = 'GET /methods';
    });

    return function GET(_x) {
        return ref.apply(this, arguments);
    };
})();

const POST = exports.POST = (function () {
    var ref = _asyncToGenerator(function* (ctx) {
        debug("Example: POST /methods");
        ctx.body = 'POST /methods';
    });

    return function POST(_x2) {
        return ref.apply(this, arguments);
    };
})();

const PUT = exports.PUT = (function () {
    var ref = _asyncToGenerator(function* (ctx) {
        debug("Example: PUT /methods");
        ctx.body = 'PUT /methods';
    });

    return function PUT(_x3) {
        return ref.apply(this, arguments);
    };
})();

const DELETE = exports.DELETE = (function () {
    var ref = _asyncToGenerator(function* (ctx) {
        debug("Example: DELETE /methods");
        ctx.body = 'DELETE /methods';
    });

    return function DELETE(_x4) {
        return ref.apply(this, arguments);
    };
})();