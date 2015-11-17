/**
 * Example of lark router
 */
'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)('lark-router');

debug("Example: set main module to example app.js for test");
process.mainModule = module;

const app = new _koa2.default();

// options is exactly the same as default options
const router = new _2.default('controllers', {
  'param_prefix': '_',
  'default': 'index'
});

debug("Example: router.routes");
app.use((0, _koaConvert2.default)(router.routes()));

debug("Example: app listening");
app.listen(3000);