/**
 * The Router class, routes for Koa like apps
 **/
'use strict';

const _         = require('lodash');
const assert    = require('assert');
const debug     = require('debug')('lark-router.router');
const Switcher  = require('switch-case');
const methods   = require('./methods');
const proxy     = require('./proxy');
const Route     = require('./route');


class Router {

    /**
     * Constructor, options are:
     * {
     *    methods: array,     customed methods, not case sensitive
     *    sensitive: boolean, whether the route path is sensitive
     * }
     **/
    constructor(options = {}) {
        debug('construct');
        assert(options instanceof Object, 'Invalid options');
        const requestMethods = [...methods.request].concat(Array.isArray(options.methods) ? options.methods : []);
        assert(Array.isArray(requestMethods), 'Preset request methods muse be an array');
        this._methods = {
            request: requestMethods.map(method => method.toUpperCase()),
            special: methods.special,
        };
        this._switcher = new Switcher(proxy.proxy);
        for (let method of requestMethods.filter(method => !methods.request.includes(method))) {
            addMethod(this, method);
        }
    }


    /**
     * Add a route rule
     **/
    route(method, routePath, handler) {
        assert('string' === typeof method, 'Method must be a string');
        method = method.toUpperCase();
        assert(this._methods.request.includes(method) || this._methods.special.includes(method),
            `Method [${method}] not supported`);
        assert('string' === typeof routePath || routePath instanceof RegExp,
            'Invalid route path, should be a string or a regular expression');
        debug(`add route [${method}] [${routePath}]`);
        const route = new Route(routePath, {
            end: handler instanceof Router ? false : true,
            sensitive: this.options.sensitive,
        });
        this._switcher.case({ method, route }, { handler });
    }

    /**
     * Returns the routes processor
     **/
    routes() {
        debug('routes');
        return async (...args) => {
            let request = args.length > 0 ? args[0] : {};
            assert(request instanceof Object, 'Invalid request, should be an object');
            request = _.pick(request, 'method', 'url');
            assert('string' === typeof request.method && 'string' === typeof request.url,
                'Invalid type of request method or url, should be a string');
            request.url = decodeURIComponent(request.url);
            debug(`routing ${request.method} ${request.url}`);

            /**
             * request: the request info for routing
             * args:    original args for routed handler
             * routed:  routed count, will increase during routing process
             * params:  params from matching route path
             **/
            return await this._switcher.dispatch({ request, args, routed: 0, params: {} });
        };
    }

}


/**
 * Add methods like: router.get(...)  router.post(...) ...
 **/
for (let method of methods.request.concat(methods.special)) {
    addMethod(Router.prototype, method);
}


function addMethod(target, method) {
    method = method.toLowerCase();
    let METHOD = method.toUpperCase();
    assert(!target[method], `Router.${method} already exists!`);
    assert(!target[METHOD], `Router.${METHOD} already exists!`);
    debug(`enable method [${method}]`);
    target[METHOD] = target[method] = function(...args) {
        return this.route(method, ...args);
    };
}


proxy.init(Router);


module.exports = Router;
