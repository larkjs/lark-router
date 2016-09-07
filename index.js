/**
 * Lark Router
 **/
'use strict';

const $           = require('lodash');
const debug       = require('debug')('lark-router.Router');
const assert      = require('assert');
const extend      = require('extend');
const methods     = require('methods');
const path2regexp = require('path-to-regexp');
const Switcher    = require('switch-case');

debug('loading ...');

class Router extends Switcher {
    // @overwrite
    constructor (options = {}) {
        debug('constructing ...');
        super();
        this._config          = $.cloneDeep(options);
        this.configure();
    }
    configure (options = {}) {
        debug('configuring ...');
        this._config = extend(true, this._config, options);
        this._httpMethods = $.cloneDeep(this._config.methods || methods).map(o => o.toLowerCase());
        this._specialMethods  = ['all', 'routed', 'other'];
        this._methods         = $.cloneDeep(this._httpMethods).concat($.cloneDeep(this._specialMethods));

        this.bindMethods();
    }
    get methods () {
        return $.cloneDeep(this._methods);
    }
    // @overwrite, default is for http/express/koa
    match (condition, req, ...args) {
        debug('matching ...');

        assert('string' === typeof req.method, 'Method must be a string!');
        const method = req.method.toLowerCase();

        if (condition.method !== method && !this._specialMethods.includes(condition.method)) {
            return false;
        }

        let params = {};
        req.routingPath = req.routingPath || req.url.split('?')[0];
        const path = req.routingPath;
        const result = condition.regexp.exec(path);
        if (!result) {
            return false;
        }

        assert(result.length >= 1, 'Internal Error!');

        const keys = condition.regexp.keys;
        for (let i = 1; i < result.length; i++) {
            const name = keys[i - 1].name;
            const index = '$' + i;
            assert(!params.hasOwnProperty(name), "Duplicated path param name [" + name + "]!");
            assert(!params.hasOwnProperty(index), "Reserved path param name [" + name + "]!");

            params[name] = params[index] = $.cloneDeep(result[i]);
        }

        const matched = () => {
            this.matched(params, req, ...args);
            return true;
        }

        if (!this._specialMethods.includes(condition.method)) {
            return matched();
        }

        switch (condition.method) {
            case 'routed':
                return req.routed ? matched() : false;
            case 'other':
                return !req.routed ? matched() : false;
            case 'all':
                return matched();
        }
        return false;
    }
    matched (params, req, ...args) {
        debug('matched ...');
        req.params = req.params || {};
        req.params = extend(true, req.params, params);
        req.routed = true;
        if (params.subroutine) {
            req.routingPath = '/' + params.subroutine;
        }
        return true;
    }
    route (method, pathexp, handler) {
        debug('setting route for [' + method + '] [' + pathexp + '] ...');
        assert('string' === typeof method, 'Method must be a string!');
        assert('string' === typeof pathexp || pathexp instanceof RegExp, 'Path expression must be a string or a Regular Expression!');

        const regexp = path2regexp(pathexp);
        return this.case({
            method: method.toLowerCase(), 
            pathexp,
            regexp
        }, handler);
    }
    routes () {
        return (...args) => {
            this.dispatch(...args);
        }
    }
    clear () {
        debug('clearing ...');
        for (let prop in this) {
            if (!(prop instanceof Function) || Router.prototype[prop]) return;
            delete this[prop];
        }
        this._cases = [];
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
        }
    }
}

debug('loaded!');
module.exports = Router;
