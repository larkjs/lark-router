/**
 * Lark router, auto generate routes by directory structure
 **/
'use strict';

const $         = require('lodash');
const debug     = require('debug')('lark-router.Router');
const assert    = require('assert');
const extend    = require('extend');
const fs        = require('fs');

const EventEmitter  = require('events').EventEmitter;

debug('loading ...');

/**
 * Define class Router
 **/
class Router extends EventEmitter {
    /**
     * Initialize
     **/
    constructor (options = {}, adapter = {}) {
        debug('constructing ...');
        super();
        this.routings = [];
        this.config  = {};
        this.adapter = {
            methods: [],
        };
        this.adapt(adapter);
        this.configure(options);
    }
    /**
     * Configure the router
     **/
    configure (options = {}) {
        debug('configuring ...');
        assert(this.config instanceof Object, 'Internal Error!');
        assert(options instanceof Object, 'Configuring options must be an object!');
        assert(this.adapter && Array.isArray(this.adapter.methods), 'Methods must be an array');

        this.config = extend(true, this.config, options);

        let methods = this.adapter.methods.map(method => method.toLowerCase());
        let METHODS = this.adapter.methods.map(method => method.toUpperCase());
        let Methods = methods.map(method => method[0].toUpperCase() + method.slice(1));

        this.methods = methods.concat(METHODS, Methods);

        debug('clearing disabled methods ...');
        Object.keys(this).filter(method => !!Router.prototype[method]).forEach(method => {
            debug('disabling [' + method + '] ...');
            delete this[method];
        }); 
        debug('enabling methods ...');
        this.methods.filter(method => !Router.prototype[method]).forEach(method => {
            debug('enabling [' + method + '] ...');
            this[method] = (...args) => this.route(method, ...args);
        });
        return this;
    }
    /**
     * Set the adapter to adapt servers, like http apps, express apps or koa apps
     **/
    adapt (adapter = {}) {
        assert(adapter instanceof Object, 'Adapter should be an object!');
        debug('adapting ...');
        this.adapter = extend(true, this.adapter, adapter);
        this.configure();
    }
    /**
     * The common route method
     **/
    route (method, route, handler) {
        assert(this.methods.includes(method), 'Undefined method [' + method + ']!');
        assert('string' === typeof route || route instanceof RegExp, 'Route path must be a string!');
        assert(handler instanceof Function || handler instanceof Router,
                'Route handler must be a Function or a Router');
        /**
         * For string routes, ignore case
         **/
        if ('string' === typeof route) {
            route = route.toLowerCase();
        }
        debug('registering route [' + method + '] [' + route + ']');

        let regexp = null;
        let params = [];

        if (this.adapter && this.adapter.prepare instanceof Function) {
            route = this.adapter.prepare(route) || route;
        }

        this.routings.push({
            method: method.toLowerCase(),
            route:  route,
            handler: handler,
        });

        return this;
    }
    /**
     * Get the routing handler by current config
     **/
    routes () {
        debug('generating routes handler ...');
        const o = {
            config: $.cloneDeep(this.config),
            routings: $.cloneDeep(this.routings),
            adapter: $.cloneDeep(this.adapter || {}),
        };

        return (...args) => {
            assert(o.adapter.mapping instanceof Function,
                  'No adapter processor to map request info to routing info!');
            let routingInfo = args;
            if (o.adapter && o.adapter.mapping instanceof Function) {
                routingInfo = o.adapter.mapping(...args) || routingInfo;
            }
            debug('routing ' + JSON.stringify(routingInfo) + ' ...');

            const matched = [];
            let routed = false;

            for (const route of o.routings) {
                const match = o.adapter.match instanceof Function ?
                              o.adapter.match : (target, route) => target === route;
                if (match(routingInfo, route.method, route.route, routed)) {
                    routed = true;
                    matched.push({route, info: routingInfo});
                }
            }

            debug('executing routing handlers ...');
            let promise = new Promise((resolve, reject) => { resolve(); });

            for (let o of matched) {
                debug('presetting handler for route ' + o.route.route.route + ' ...');
                promise = promise.then(() => {
                    debug('calling handler for route ' + o.route.route.route + ' ...');
                    if (this.adapter && this.adapter.params) {
                        this.adapter.params(o.route.route, ...args);
                    }
                    return o.route.handler(...args);
                });
            };

            promise.catch(e => this.emit('error', e, ...args));

            return promise;
        };
    }
}

module.exports = Router;

debug('loaded!');
