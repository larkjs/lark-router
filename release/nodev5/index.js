/**
 * Lark router
 **/
'use strict';

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

const debug = (0, _debug3.default)('lark-router');

class Router extends _koaRouter2.default {
    constructor(root) {
        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        debug('Router: Router.constructor');
        if ('string' !== typeof root) {
            throw new Error("Router root directory should be a string, " + typeof root + " given");
        }
        debug('Router: Router.constructor super');
        super();
        if (!_path2.default.isAbsolute(root)) {
            debug('Router: root is not absolute, make an absolute one');
            root = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), root);
        }
        if (!_fs2.default.statSync(root).isDirectory()) {
            throw new Error("Router root is not a directory path");
        }
        debug('Router: route is ' + root);
        this.root = root;
        this.options = options;
        this.routeSet = new Set();

        this.options.param_prefix = this.options.param_prefix || '_';
        if ('string' !== typeof this.options.param_prefix || !this.options.param_prefix.match(/^\S+$/)) {
            throw new Error("Router options param_prefix must be a string matching patter \\S+");
        }
        this.options.prefix_esc = (0, _escapeStringRegexp2.default)(this.options.param_prefix);

        this.options.default = this.options.default || 'index';
        if ('string' !== typeof this.options.default || this.options.default.length === 0) {
            throw new Error("Router options default must be a string");
        }

        this.load();
    }
    create(root, options) {
        debug('Router: Router.create');
        if (!_path2.default.isAbsolute(root)) {
            debug('Router: root is not absolute, make an absolute one');
            root = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), root);
        }
        return new Router(root, options);
    }
    load(dirname) {
        debug('Router: loading by dirname');
        if ('string' !== typeof dirname) {
            dirname = '.';
        }
        let absoluteDirname;
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
        let dirlist = [];
        let filelist = [];
        let list = _fs2.default.readdirSync(absoluteDirname);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                let filename = _step.value;

                const absoluteFileName = _path2.default.join(absoluteDirname, filename);
                const stat = _fs2.default.statSync(absoluteFileName);
                let relativeFileName = _path2.default.join(dirname, filename);
                if (stat.isDirectory()) {
                    dirlist.push(relativeFileName);
                } else if (stat.isFile()) {
                    filelist.push(relativeFileName);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = filelist[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                let relativeFileName = _step2.value;

                debug('Router: load file in path (' + relativeFileName + ')');
                if (_path2.default.extname(relativeFileName) !== '.js') {
                    debug('Router: not js file, abort');
                    continue;
                }
                const absoluteFileName = _path2.default.join(this.root, relativeFileName);
                let routePath = relativeFileName.slice(0, -_path2.default.extname(relativeFileName).length);
                const prefix_esc = this.options.prefix_esc;
                const param_prefix = this.options.param_prefix;
                routePath = routePath.replace(new RegExp("\\/" + prefix_esc + "(?!(" + prefix_esc + ")|$)", 'g'), "/:").replace(new RegExp("\\/" + prefix_esc + prefix_esc, 'g'), "/" + param_prefix);
                const routePathSplit = routePath.split('/');
                if (routePathSplit[routePathSplit.length - 1] === this.options.default) {
                    routePathSplit.pop();
                    routePath = routePathSplit.join('/') || '/';
                }
                debug('Router: load file as route path (' + routePath + ')');

                const fileModule = require(absoluteFileName);

                if (fileModule.default) {
                    debug('Router: use default as get');
                    fileModule.get = fileModule.default;
                }

                let redirect = false;
                for (let method in fileModule) {
                    let method_uc = method.toUpperCase();
                    if (method_uc !== 'REDIRECT' && 'string' !== typeof fileModule[method]) {
                        continue;
                    }
                    const routeDescription = method_uc + " " + routePath + " => " + fileModule[method];
                    const routeDescriptionRegexp = routeDescription.replace(/\/(:[^\/]+)/g, '/*');
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

                for (let method in fileModule) {
                    let method_lc = method.toLowerCase();
                    let method_uc = method.toUpperCase();
                    const routeDescription = method_uc + " " + routePath;
                    const routeDescriptionRegexp = routeDescription.replace(/\/(:[^\/]+)/g, '/*');
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
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = dirlist[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                let relativeDirName = _step3.value;

                debug('Router: load directory in path ' + relativeDirName);
                this.load(_path2.default.join(this.root, relativeDirName));
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return this;
    }
};

// Match Koa 2.x
Router.prototype.routes = Router.prototype.middleware = function () {
    const router = this;
    const dispatch = (function () {
        var ref = _asyncToGenerator(function* (ctx, next) {
            const path = router.opts.routerPath || ctx.routerPath || ctx.path;
            const matched = router.match(path, ctx.method);
            let layer;
            let i;
            let ii;
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
