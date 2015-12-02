/**
 * Lark router, auto generate routes by directory structure
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

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _escapeStringRegexp = require('escape-string-regexp');

var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug3.default)('lark-router');

/**
 * Extends KoaRouter with the following methods:
 * @method create(options) returns a new instance of Router
 * @method load(directory, options) generate routes by the directory structure
 **/

var Router = (function (_KoaRouter) {
    _inherits(Router, _KoaRouter);

    function Router() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Router);

        if (options && !(options instanceof Object)) {
            throw new Error('Options must be an object if given');
        }
        debug('Router: Router.constructor');

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Router).call(this, options));

        _this.opts.param_prefix = _this.opts.param_prefix || '_';
        if ('string' !== typeof _this.opts.param_prefix || !_this.opts.param_prefix.match(/^\S+$/)) {
            throw new Error("Router options param_prefix must be a string matching patter \\S+");
        }
        _this.opts.prefix_esc = (0, _escapeStringRegexp2.default)(_this.opts.param_prefix);

        _this.opts.default = _this.opts.default || 'index';
        if ('string' !== typeof _this.opts.default || _this.opts.default.length === 0) {
            throw new Error("Router options default must be a string");
        }
        return _this;
    }

    _createClass(Router, [{
        key: 'load',
        value: function load(root, prefix) {
            debug('Router: loading by root path ' + root);
            if ('string' !== typeof root) {
                throw new Error('Router loading root path is not a string');
            }

            root = _path2.default.normalize(root);

            if (!_path2.default.isAbsolute(root)) {
                debug('Router: root is not absolute, make an absolute one');
                root = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), root);
            }

            if (prefix) {
                prefix = _path2.default.normalize(prefix);
                if (!prefix || !prefix[0] || prefix[0] === '.') {
                    throw new Error('Invalid router prefix ' + prefix);
                }
                debug('Router: create a new Router to load with prefix ' + prefix);
                var opts = (0, _extend2.default)(true, {}, this.opts);
                opts.routePrefix = opts.routePrefix || '';
                opts.routePrefix += prefix;
                var router = Router.create(opts).load(root);
                debug('Router: using the router with prefix ' + prefix);
                this.use(prefix, router.routes());
                return this;
            }

            debug('Router; loading by directory structure of ' + root);

            /**
             * First load all files, then load directories recrusively
             **/
            var dirlist = [];
            var filelist = [];
            var list = _fs2.default.readdirSync(root);
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

                var routePath = name2routePath(filename, this.options);
                if (routePath === false) {
                    continue;
                }
                routePath = '/' + routePath;
                var item = { filename: filename, routePath: routePath };
                var absolutePath = _path2.default.join(root, filename);
                var stat = _fs2.default.statSync(absolutePath);
                if (stat.isDirectory()) {
                    dirlist.push(item);
                } else if (stat.isFile()) {
                    filelist.push(item);
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

                var item = _ref2;

                loadRouteByFilename(this, item.filename, item.routePath, root);
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

                var item = _ref3;

                this.load(_path2.default.join(root, item.filename), item.routePath);
            }
            return this;
        }
    }], [{
        key: 'create',
        value: function create(options) {
            debug('Router: Router.create');
            return new Router(options);
        }
    }]);

    return Router;
})(_koaRouter2.default);

function name2routePath(name, options) {
    debug('Router: convert name to route path : ' + name);
    if ('string' !== typeof name) {
        throw new Error('Name must be a string');
    }
    if (name === (options.default || 'index.js')) {
        return '';
    }
    var extname = _path2.default.extname(name);
    if (extname && extname !== '.js') {
        return false;
    }
    name = _path2.default.basename(name, extname);
    if (!name || name[0] === '.') {
        return false;
    }

    var prefix = options.param_prefix || '_';
    var prefix_esc = (0, _escapeStringRegexp2.default)(prefix);

    var routePath = name.replace(new RegExp("^" + prefix_esc + "(?!(" + prefix_esc + ")|$)"), ":").replace(new RegExp("^" + prefix_esc + prefix_esc), prefix);

    debug('Router: convert result is ' + routePath);
    return routePath;
}

function loadRouteByFilename(router, filename, routePath, root) {
    if ('string' !== typeof filename || 'string' !== typeof root) {
        throw new Error('Invalid param to load by dirname');
    }
    debug('Router: loading file ' + filename);
    if (_path2.default.extname(filename) !== '.js' || filename.length <= 3) {
        return;
    }

    debug("Router: route path [" + routePath + "]");
    var absolutePath = _path2.default.join(root, filename);
    //import fileModule from absolutePath;
    var fileModule = require(absolutePath).default || require(absolutePath);

    if (fileModule instanceof Function) {
        debug("Router: module is a function, use it to handle router directly");
        var subRouter = Router.create(router.opts);
        var result = fileModule(subRouter);
        if (result instanceof Router) {
            subRouter = result;
        }
        router.use(routePath, subRouter.routes());
    } else if (fileModule instanceof Object) {
        loadByModule(router, routePath, fileModule);
    } else {
        throw new Error('Invalid router module');
    }
}

function loadByModule(router, routePath, module) {
    debug("Router: load route by module");

    //handle redirect routes
    for (var method_ori in module) {
        var METHOD = method_ori.toUpperCase();
        if (METHOD !== 'REDIRECT' || 'string' !== typeof module[method_ori]) {
            continue;
        }

        var desc = METHOD + ' ' + (router.opts.routePrefix || '') + routePath;
        debug("Router: add router " + _chalk2.default.yellow(desc + " => " + module[method_ori]));
        router.redirect(routePath, module[method_ori]);
        return;
    }

    //handle methods
    for (var method_ori in module) {
        var method = method_ori.toLowerCase();
        var METHOD = method_ori.toUpperCase();

        var desc = METHOD + ' ' + (router.opts.routePrefix || '') + routePath;

        if (!(module[method_ori] instanceof Function) || router.methods.indexOf(METHOD) < 0) {
            continue;
        }
        debug("Router: add router " + _chalk2.default.yellow(desc));

        router[method](routePath, module[method_ori]);
    }
}

exports.default = Router;

debug('Router: load ok');
