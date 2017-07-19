/**
 * Lark Router
 **/
'use strict';

const assert        = require('assert');
const debug         = require('debug')('lark-router.Router');
const events        = require('events');

const methods       = require('./methods');
const Route         = require('./Route');
const Switcher      = require('./Switcher');

class Router extends events.EventEmitter {

    constructor() {
        debug('construct');
        super();
        this.switcher = new Switcher();
    }

    route(method, routePath, handler) {
        debug(`route [${method}] [${routePath}]`);
        const typeofMethod = typeof method;
        assert('string' === typeofMethod, `Method should be a string, ${typeofMethod} given`);
        method = method.toUpperCase();
        const methodsSupported = methods.request.concat(methods.special);
        assert(methodsSupported.includes(method), `Method ${method} not support`);

        assert('string' === typeof routePath || routePath instanceof RegExp,
            `Route should be a string or a regular expression, ${typeof routePath} given`);

        let route = null;
        if (handler instanceof Router) {
            route = new Route(routePath, { end: false });
            handler = handler.switcher;
        }
        else {
            route = new Route(routePath);
        }
        
        this.switcher.case({ method, route }, handler, { break: false });
    }

    routes() {
        debug('routes');
        return (...args) => {
            let request = args[0] || {};
            request = {
                method: (request.method || 'GET').toUpperCase(),
                path: request.path || request.url || '/',
            };
            debug(`on routing ${request.method} ${request.path}`);
            let routed = 0;
            return this.switcher.dispatch({ request, routed, args });
        };
    }
}

for (const method of methods.request.concat(methods.special).map(method => method.toLowerCase())) {
    Router.prototype[method] = function(...args) {
        return this.route(method, ...args);
    };
}

module.exports = Router;
