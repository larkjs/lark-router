/**
 * Lark Router
 **/
'use strict';

const assert        = require('assert');
const events        = require('events');
const path2regexp   = require('path-to-regexp');

const methods       = require('./methods');
const Switcher      = require('./Switcher');

class Router extends events.EventEmitter {

    constructor() {
        super();
        this.switcher = new Switcher();
    }

    route(method, route, handler) {
        const typeofMethod = typeof method;
        assert('string' === typeofMethod, `Method should be a string, ${typeofMethod} given`);
        method = method.toUpperCase();
        const methodsSupported = methods.request.concat(methods.special);
        assert(methodsSupported.includes(method), `Method ${method} not support`);

        assert('string' === typeof route || route instanceof RegExp,
            `Route should be a string or a regular expression, ${typeof route} given`);

        let regexp = null;
        if (handler instanceof Router) {
            regexp = path2regexp(route, null, { end: false });
            handler = handler.switcher;
        }
        else {
            regexp = path2regexp(route);
        }
        
        this.switcher.case({ method, regexp }, handler);
    }

    routes() {
        return (...args) => {
            let request = args[0];
            request = {
                method: request.method.toUpperCase(),
                path: request.path || request.url,
            };
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
