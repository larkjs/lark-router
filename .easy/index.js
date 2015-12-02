/**
 * Lark router, auto generate routes by directory structure
 **/
'use strict';

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

const debug = (0, _debug3.default)('lark-router');

/**
 * Extends KoaRouter with the following methods:
 * @method create(options) returns a new instance of Router
 * @method load(directory, options) generate routes by the directory structure
 **/
class Router extends _koaRouter2.default {
    constructor() {
        let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        if (options && !(options instanceof Object)) {
            throw new Error('Options must be an object if given');
        }
        debug('Router: Router.constructor');
        super(options);

        this.opts.param_prefix = this.opts.param_prefix || '_';
        if ('string' !== typeof this.opts.param_prefix || !this.opts.param_prefix.match(/^\S+$/)) {
            throw new Error("Router options param_prefix must be a string matching patter \\S+");
        }
        this.opts.prefix_esc = (0, _escapeStringRegexp2.default)(this.opts.param_prefix);

        this.opts.default = this.opts.default || 'index';
        if ('string' !== typeof this.opts.default || this.opts.default.length === 0) {
            throw new Error("Router options default must be a string");
        }
    }
    static create(options) {
        debug('Router: Router.create');
        return new Router(options);
    }
    load(root, prefix) {
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
            const opts = (0, _extend2.default)(true, {}, this.opts);
            opts.routePrefix = opts.routePrefix || '';
            opts.routePrefix += prefix;
            const router = Router.create(opts).load(root);
            debug('Router: using the router with prefix ' + prefix);
            this.use(prefix, router.routes());
            return this;
        }

        debug('Router; loading by directory structure of ' + root);

        /**
         * First load all files, then load directories recrusively
         **/
        const dirlist = [];
        const filelist = [];
        const list = _fs2.default.readdirSync(root);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                const filename = _step.value;

                let routePath = name2routePath(filename, this.options);
                if (routePath === false) {
                    continue;
                }
                routePath = '/' + routePath;
                const item = { filename, routePath };
                const absolutePath = _path2.default.join(root, filename);
                const stat = _fs2.default.statSync(absolutePath);
                if (stat.isDirectory()) {
                    dirlist.push(item);
                } else if (stat.isFile()) {
                    filelist.push(item);
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
                const item = _step2.value;

                loadRouteByFilename(this, item.filename, item.routePath, root);
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
                const item = _step3.value;

                this.load(_path2.default.join(root, item.filename), item.routePath);
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
}

function name2routePath(name, options) {
    debug('Router: convert name to route path : ' + name);
    if ('string' !== typeof name) {
        throw new Error('Name must be a string');
    }
    if (name === (options.default || 'index.js')) {
        return '';
    }
    const extname = _path2.default.extname(name);
    if (extname && extname !== '.js') {
        return false;
    }
    name = _path2.default.basename(name, extname);
    if (!name || name[0] === '.') {
        return false;
    }

    const prefix = options.param_prefix || '_';
    const prefix_esc = (0, _escapeStringRegexp2.default)(prefix);

    let routePath = name.replace(new RegExp("^" + prefix_esc + "(?!(" + prefix_esc + ")|$)"), ":").replace(new RegExp("^" + prefix_esc + prefix_esc), prefix);

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
    const absolutePath = _path2.default.join(root, filename);
    //import fileModule from absolutePath;
    let fileModule = require(absolutePath).default || require(absolutePath);

    if (fileModule instanceof Function) {
        debug("Router: module is a function, use it to handle router directly");
        let subRouter = Router.create(router.opts);
        let result = fileModule(subRouter);
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
    for (const method_ori in module) {
        const METHOD = method_ori.toUpperCase();
        if (METHOD !== 'REDIRECT' || 'string' !== typeof module[method_ori]) {
            continue;
        }

        const desc = METHOD + ' ' + (router.opts.routePrefix || '') + routePath;
        debug("Router: add router " + _chalk2.default.yellow(desc + " => " + module[method_ori]));
        router.redirect(routePath, module[method_ori]);
        return;
    }

    //handle methods
    for (const method_ori in module) {
        const method = method_ori.toLowerCase();
        const METHOD = method_ori.toUpperCase();

        const desc = METHOD + ' ' + (router.opts.routePrefix || '') + routePath;

        if (!(module[method_ori] instanceof Function) || router.methods.indexOf(METHOD) < 0) {
            continue;
        }
        debug("Router: add router " + _chalk2.default.yellow(desc));

        router[method](routePath, module[method_ori]);
    }
}

exports.default = Router;

debug('Router: load ok');
