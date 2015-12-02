'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GET = undefined;

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

const debug = (0, _debug3.default)('lark-router');

const GET = exports.GET = (function () {
    var ref = _asyncToGenerator(function* (ctx) {
        debug("Example: GET /waiting");
        const seconds = parseInt(ctx.query.time) * 1000 || 2000;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                ctx.body = 'GET /waiting';
                resolve();
            }, seconds);
        });
    });

    return function GET(_x) {
        return ref.apply(this, arguments);
    };
})();