/**
 * Lark router
 **/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _escapeStringRegexp = require('escape-string-regexp');

var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug3.default)('lark-router');

var Router = (function (_KoaRouter) {
    _inherits(Router, _KoaRouter);

    function Router(root) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Router);

        debug('Router: Router.constructor');
        if ('string' !== typeof root) {
            throw new Error("Router root directory should be a string, " + (typeof root === 'undefined' ? 'undefined' : _typeof(root)) + " given");
        }
        debug('Router: Router.constructor super');

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this));

        if (!_path2.default.isAbsolute(root)) {
            debug('Router: root is not absolute, make an absolute one');
            root = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), root);
        }
        if (!_fs2.default.statSync(root).isDirectory()) {
            throw new Error("Router root is not a directory path");
        }
        debug('Router: route is ' + root);
        _this.root = root;
        _this.options = options;
        _this.routeSet = new Set();

        _this.options.param_prefix = _this.options.param_prefix || '_';
        if ('string' !== typeof _this.options.param_prefix || !_this.options.param_prefix.match(/^\S+$/)) {
            throw new Error("Router options param_prefix must be a string matching patter \\S+");
        }
        _this.options.prefix_esc = (0, _escapeStringRegexp2.default)(_this.options.param_prefix);

        _this.options.default = _this.options.default || 'index';
        if ('string' !== typeof _this.options.default || _this.options.default.length === 0) {
            throw new Error("Router options default must be a string");
        }

        _this.load();
        return _this;
    }

    _createClass(Router, [{
        key: 'create',
        value: function create(root, options) {
            debug('Router: Router.create');
            if (!_path2.default.isAbsolute(root)) {
                debug('Router: root is not absolute, make an absolute one');
                root = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), root);
            }
            return new Router(root, options);
        }
    }, {
        key: 'load',
        value: function load(dirname) {
            debug('Router: loading by dirname');
            if ('string' !== typeof dirname) {
                dirname = '.';
            }
            var absoluteDirname = undefined;
            if (_path2.default.isAbsolute(dirname)) {
                debug('Router: dirname is absolute');
                absoluteDirname = dirname;
            } else {
                debug('Router: dirname is not absolute, make an absolute one');
                absoluteDirname = _path2.default.join(this.root, dirname);
            }
            debug('Router: absolute dirname is ' + absoluteDirname);
            if (absoluteDirname.slice(0, this.root.length) !== this.root) {
                throw new Error("Access denied, router can not load directory " + absoluteDirname);
            }
            dirname = absoluteDirname.slice(this.root.length) || '/';
            debug('Router: loading all files and directories under ' + dirname);
            var dirlist = [];
            var filelist = [];
            var list = _fs2.default.readdirSync(absoluteDirname);
            for (var _iterator = list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var filename = _ref;

                var absoluteFileName = _path2.default.join(absoluteDirname, filename);
                var stat = _fs2.default.statSync(absoluteFileName);
                var relativeFileName = _path2.default.join(dirname, filename);
                if (stat.isDirectory()) {
                    dirlist.push(relativeFileName);
                } else if (stat.isFile()) {
                    filelist.push(relativeFileName);
                }
            }
            for (var _iterator2 = filelist, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var relativeFileName = _ref2;

                debug('Router: load file in path (' + relativeFileName + ')');
                if (_path2.default.extname(relativeFileName) !== '.js') {
                    debug('Router: not js file, abort');
                    continue;
                }
                var absoluteFileName = _path2.default.join(this.root, relativeFileName);
                var routePath = relativeFileName.slice(0, -_path2.default.extname(relativeFileName).length);
                var prefix_esc = this.options.prefix_esc;
                var param_prefix = this.options.param_prefix;
                routePath = routePath.replace(new RegExp("\\/" + prefix_esc + "(?!(" + prefix_esc + ")|$)", 'g'), "/:").replace(new RegExp("\\/" + prefix_esc + prefix_esc, 'g'), "/" + param_prefix);
                var routePathSplit = routePath.split('/');
                if (routePathSplit[routePathSplit.length - 1] === this.options.default) {
                    routePathSplit.pop();
                    routePath = routePathSplit.join('/') || '/';
                }
                debug('Router: load file as route path (' + routePath + ')');

                var fileModule = require(absoluteFileName);

                if (fileModule.default) {
                    debug('Router: use default as get');
                    fileModule.get = fileModule.default;
                }

                var redirect = false;
                for (var method in fileModule) {
                    var method_uc = method.toUpperCase();
                    if (method_uc !== 'REDIRECT' && 'string' !== typeof fileModule[method]) {
                        continue;
                    }
                    var routeDescription = method_uc + " " + routePath + " => " + fileModule[method];
                    var routeDescriptionRegexp = routeDescription.replace(/\/(:[^\/]+)/g, '/*');
                    if (this.routeSet.has(routeDescriptionRegexp)) {
                        throw new Error("Route " + routeDescriptionRegexp + " duplicated");
                    }
                    debug("Router: add router [" + routeDescription + "]");
                    this.redirect(routePath, fileModule[method]);
                    redirect = true;
                    this.routeSet.add(routeDescriptionRegexp);
                }
                if (redirect) {
                    continue;
                }

                for (var method in fileModule) {
                    var method_lc = method.toLowerCase();
                    var method_uc = method.toUpperCase();
                    var routeDescription = method_uc + " " + routePath;
                    var routeDescriptionRegexp = routeDescription.replace(/\/(:[^\/]+)/g, '/*');
                    if (this.routeSet.has(routeDescriptionRegexp)) {
                        throw new Error("Route " + routeDescriptionRegexp + " duplicated");
                    }
                    if (!(fileModule[method] instanceof Function) || this.methods.indexOf(method_uc) < 0) {
                        continue;
                    }
                    debug("Router: add router [" + method_uc + " " + routePath + "]");
                    this[method_lc](routePath, fileModule[method]);
                    this.routeSet.add(routeDescriptionRegexp);
                }
            }
            for (var _iterator3 = dirlist, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                var _ref3;

                if (_isArray3) {
                    if (_i3 >= _iterator3.length) break;
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) break;
                    _ref3 = _i3.value;
                }

                var relativeDirName = _ref3;

                debug('Router: load directory in path ' + relativeDirName);
                this.load(_path2.default.join(this.root, relativeDirName));
            }
            return this;
        }
    }]);

    return Router;
})(_koaRouter2.default);

;

// Match Koa 2.x
Router.prototype.routes = Router.prototype.middleware = function () {
    var router = this;
    var dispatch = (function () {
        var ref = _asyncToGenerator(function* (ctx, next) {
            var path = router.opts.routerPath || ctx.routerPath || ctx.path;
            var matched = router.match(path, ctx.method);
            var layer = undefined;
            var i = undefined;
            var ii = undefined;
            if (ctx.matched) {
                ctx.matched.push.apply(ctx.matched, matched.path);
            } else {
                ctx.matched = matched.path;
            }

            if (matched.pathAndMethod.length) {
                i = matched.pathAndMethod.length;
                while (matched.route && i--) {
                    layer = matched.pathAndMethod[i];
                    ii = layer.stack.length;
                    ctx.captures = layer.captures(path, ctx.captures);
                    ctx.params = layer.params(path, ctx.captures, ctx.params);

                    while (ii--) {
                        yield layer.stack[ii](ctx);
                    }
                }
            }

            yield next();
        });

        return function dispatch(_x2, _x3) {
            return ref.apply(this, arguments);
        };
    })();
    dispatch.router = router;
    return dispatch;
};

exports.default = Router;

debug('Router: load ok');
