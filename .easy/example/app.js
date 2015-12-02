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

var debug = (0, _debug3.default)('lark-router');

debug("Example: set main module to example app.js for test");
process.mainModule = module;

// options is exactly the same as default options
var router = new _2.default({
  'directory': 'controllers',
  'param_prefix': '_',
  'default': 'index'
});

/**
 * Not implemented in verions 0.x

router.redirect("/haohao", "/methods");
router.all("*", function * (next) {
    const ctx = this;
    debug("Example: router.all " + ctx.method + ' ' + ctx.url);
});

 *
 **/

debug("Example: router.routes");
var app = new _koa2.default();
app.use(router);

debug("Example: app listening");
//export for super test
exports.default = app.listen(3000);