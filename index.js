/**
 * Lark Router
 **/
'use strict';

const $             = require('lodash');
const debug         = require('debug')('lark-router.Router');
const assert        = require('assert');
const extend        = require('extend');
const fs            = require('fs');
const methods       = require('methods');
const path          = require('path');
const path2regexp   = require('path-to-regexp');
const Switcher      = require('switch-case');
const EventEmitter  = require('events').EventEmitter;

debug('loading ...');
class Router extends EventEmitter {
    // @overwrite
    constructor (options = {}) {
        debug('constructing ...');
        super();
        this._switcher = new Switcher();
        this._enabledMethods = [];
        this._config = $.cloneDeep(options);
        this.configure();

        // overwrting switcher methods
        this._switcher.prepare = this._prepare.bind(this);
        this._switcher.match   = this._match.bind(this);
        this._switcher.proxy   = this._proxy.bind(this);
        this._switcher.execute = this._execute.bind(this);
    }
    // @overwrite switcher
    _prepare (o, req, ...args) {
        debug('preparing ...');
        o = extend(true, {}, o);
        return [o, req, ...args];
    }
    // @overwrite switcher
    _match (condition, o, req, ...args) {
        debug('matching ...');
        assert('string' === typeof o.method && 'string' === typeof o.path, 'Method and URL must be string!');

        debug('testing [' + o.method.toUpperCase() + ' ' + o.path + '] with [' + condition.method.toUpperCase() + ' ' + condition.pathexp + '] ...');
        if ((condition.method !== o.method || (this._config.max > 0 && this._config.max <= req.routed))
            && !this._specialMethods.includes(condition.method)) {
            return false;
        }

        const result = condition.regexp.exec(o.path);
        if (!result) return false;

        if ((condition.method === 'routed' && !req.routed) ||
            (condition.method === 'other'  && req.routed)) {
            return false;
        }

        assert(result.length >= 1, 'Internal Error!');

        debug('matched!');

        const keys = condition.regexp.keys;
        const startIndex = Object.keys(o.params).length / 2;
        for (let i = 1; i < result.length; i++) {
            const name = keys[i - 1].name;
            const index = '$' + (i + startIndex);
            assert(!o.params.hasOwnProperty(name), "Duplicated path param name [" + name + "]!");
            assert(!o.params.hasOwnProperty(index), "Reserved path param name [" + name + "]!");

            o.params[name] = o.params[index] = $.cloneDeep(result[i]) || '/';
            if (condition.proxy && name === this.subroutine) {
                o.subroutineIndex = index;
            }
        }
        condition.proxy && (o.subroutine = this.subroutine);
        
        return true;
    }
    // @overwrite switcher
    _proxy (o, req, ...args) {
        debug('proxying to a sub router ...');
        o = extend(true, {}, o);
        const subroutine = this.subroutine;
        assert('string' === typeof o.params[o.subroutine], 'subroutine not found!');
        o.path = o.params[o.subroutine];
        if (o.path[0] != '/') o.path = '/' + o.path;
        delete o.params[o.subroutine];
        delete o.params[o.subroutineIndex];
        delete o.subroutineIndex;
        delete o.subroutine;
        req.routed--;
        
        return [o, req, ...args];
    }
    // @overwrite switcher
    _execute (result, o, req, ...args) {
        req.params = $.cloneDeep(o.params);
        req.routed++;
        return result(req, ...args);
    }
    configure (options = {}) {
        debug('configuring ...');
        this._config          = extend(true, this._config, options);
        this._httpMethods     = $.cloneDeep(this._config.methods || methods).map(o => o.toLowerCase());
        this._specialMethods  = ['all', 'routed', 'other'];
        this._methods         = $.cloneDeep(this._httpMethods).concat($.cloneDeep(this._specialMethods));

        this.bindMethods();
    }
    get methods () {
        return $.cloneDeep(this._methods);
    }
    get subroutine () {
        return this._config.subroutine || 'subroutine';
    }
    route (method, pathexp, handler) {
        debug('setting route for [' + method + '] [' + pathexp + '] ...');
        assert('string' === typeof method, 'Method must be a string!');
        method = method.toLowerCase();
        assert(this._methods.includes(method), 'Invalid Method!');
        assert('string' === typeof pathexp || pathexp instanceof RegExp, 'Path expression must be a string or a Regular Expression!');

        const regexp = path2regexp(pathexp);
        let proxy = false;
        if (handler instanceof Router) {
            handler = handler._switcher;
            proxy = true;
        }
        return this._switcher.case({ method, pathexp, regexp, proxy }, handler, { break: false });
    }
    routes () {
        return (req, ...args) => {
            assert('string' === typeof req.url, 'URL must be a string');
            assert('string' === typeof req.method, 'METHOD must be a string');
            debug(`routing ${req.method.toUpperCase()} ${req.url} ...`);
            const o = {
                path: decodeURIComponent(req.url.split('?')[0]),
                method: req.method.toLowerCase(),
                params: {}
            };
            assert(this._httpMethods.includes(o.method), 'Invalid METHOD [' + req.method + ']');

            req.routed = 0;

            return this._switcher.dispatch(o, req, ...args).catch(e => this.emit('error', e, req, ...args));
        }
    }
    clear () {
        debug('clearing ...');
        let method = null;
        while (method = this._enabledMethods.pop()) {
            delete this[method];
        }
        this._switcher._cases = [];
        return this;
    }
    bindMethods () {
        debug('binding methods ...');
        this.clear();
        for (let item of this.methods) {
            debug('binding method [' + item + '] ...');
            const Method = item[0].toUpperCase() + item.slice(1).toLowerCase();
            const method = Method.toLowerCase();
            const METHOD = Method.toUpperCase();
            assert(!this[method] && !this[Method] && !this[METHOD], 'Can not assign method ' + METHOD + ' to router');
            this[method] = this[Method] = this[METHOD] = (pathexp, handler) => {
                return this.route(method, pathexp, handler);
            }
            this._enabledMethods.push(method, Method, METHOD);
        }
    }
    load (filename, prefix = null) {
        assert('string' === typeof filename, 'File name must be a string!');
        if ('string' === typeof prefix) {
            const router = new Router(this._config);
            this.all(`/${prefix}/:${this.subroutine}*`, router);
            router.load(filename);
            return this;
        }
        const rootdirname = path.dirname(process.mainModule.filename);
        if (!path.isAbsolute(filename)) {
            filename = path.join(rootdirname, filename);
        }
        debug(`loading ${path.relative(rootdirname, filename)} ...`);
        const stat = fs.statSync(filename);
        if (stat.isFile()) {
            const filemodule = require(filename);
            if (filemodule instanceof Function) {
                const proxy = filemodule;
                proxy(this);
                return this;
            }
            assert(filemodule instanceof Object, 'When using a file as a router, exports must be a function or an object');
            Object.keys(filemodule)
                .filter(method => 'string' === typeof method)
                .map(method => method.toLowerCase())
                .filter(method => this._methods.includes(method))
                .forEach(method => {
                const handler = filemodule[method];
                this.route(method, '/', handler);
            });

            return this;
        }
        const dirname = filename;
        const subfiles = fs.readdirSync(dirname);
        for (let subfile of subfiles) {
            const subfilename = path.join(dirname, subfile);
            const stat = fs.statSync(subfilename);

            subfile = path.basename(subfile);
            if (stat.isFile()) {
                subfile = path.basename(subfile, path.extname(subfile));
            }

            subfile = this.parseFileName(subfile);

            const router = new Router(this._config);
            router.load(subfilename, subfile);
        }
        return this;
    }
    parseFileName (filename) {
        return filename;
    }
}

debug('loaded!');
module.exports = Router;
