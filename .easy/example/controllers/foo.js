'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('lark-router');

exports.default = function (router) {
    router.get('/', function* (next) {
        var ctx = this;
        debug("Example: GET /foo");
        ctx.body = 'GET /foo';
        yield next;
    });
};