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
        this.configure(options);

        // overwrting switcher methods
        this._switcher.prepare = this._prepare.bind(this);
        this._switcher.match   = this._match.bind(this);
        this._switcher.nesting = this._nesting.bind(this);
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
        const startIndex = Object.keys(o.params).length;
        for (let i = 1; i < result.length; i++) {
            const index = i - 1;
            let name = keys[index].name;
            if ('number' === typeof name) {
                name += startIndex;
            }
            assert(!o.params.hasOwnProperty(name), "Duplicated path param name [" + name + "]!");

            o.params[name] = $.cloneDeep(result[i]) || '/';
        }
        condition.nesting && (o.subroutine = this.subroutine);
        
        return true;
    }
    // @overwrite switcher
    _nesting (o, req, ...args) {
        debug('passing args to the nested router ...');
        o = extend(true, {}, o);
        const subroutine = this.subroutine;
        assert('string' === typeof o.params[o.subroutine], 'subroutine not found!');
        o.path = o.params[o.subroutine];
        if (o.path[0] != '/') o.path = '/' + o.path;
        delete o.params[o.subroutine];
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
        assert(options instanceof Object, 'Options must be an object!');

        this._config          = this._config instanceof Object ? this._config : $.cloneDeep(defaultConfig);
        assert(this._config instanceof Object, 'Internal Error');

        if (!Array.isArray(options.methods) || options.methods.length <= 0) {
            options.methods = methods;
        }

        this._config          = extend(true, this._config, options);
        assert(Array.isArray(this._config.methods), 'Methods must be an array!');

        this._httpMethods     = $.cloneDeep(this._config.methods).map(o => o.toLowerCase());
        this._specialMethods  = ['all', 'routed', 'other'];
        this._methods         = $.cloneDeep(this._httpMethods).concat($.cloneDeep(this._specialMethods));

        this.bindMethods();

        return this;
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

        let nesting = false;
        if (handler instanceof Router) {
            handler = handler._switcher;
            nesting = true;
            if (this._config['nesting-path-auto-complete'] && !(pathexp instanceof RegExp)) {
                if (!pathexp.endsWith('/')) pathexp += '/';
                pathexp += `:${this.subroutine}*`;
            }
        }
        const regexp = path2regexp(pathexp);
        return this._switcher.case({ method, pathexp, regexp, nesting }, handler, { break: false });
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
            this[method] = this[Method] = this[METHOD] = (pathexp, handler) => {
                return this.route(method, pathexp, handler);
            }
            this._enabledMethods.push(method, Method, METHOD);
        }
    }
}

const defaultConfig = {
    max: 0,                               // max routed limit, 0 refers to unlimited
    methods: methods,                     // methods to support
    subroutine: 'subroutine',             // subroutine param name for router's nesting
    'nesting-path-auto-complete': true,   // whether if auto complete the route path for nesting routes
}

debug('loaded!');
module.exports = Router;
