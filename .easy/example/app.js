/**
 * Example of lark router
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var debug = (0, _debug3.default)('lark-router');

debug("Example: set main module to example app.js for test");
process.mainModule = module;

// options is exactly the same as default options
var router = new _2.default({
    'param_prefix': '_',
    'default': 'index'
}).load('controllers');

router.redirect("/haohao", "/methods");
router.all("*", (function () {
    var ref = _asyncToGenerator(function* (ctx) {
        debug("Example: router.all " + ctx.method + ' ' + ctx.url);
    });

    return function (_x) {
        return ref.apply(this, arguments);
    };
})());

debug("Example: router.routes");
var app = new _koa2.default();
app.use(router.routes());

debug("Example: app listening");
//export for super test
exports.default = app.listen(3000);