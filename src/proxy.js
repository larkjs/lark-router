/**
 * The switcher proxy, handles routing works, see [github]viRingbells/switch-case for more info
 **/
'use strict';

const assert  = require('assert');
const debug   = require('debug')('lark-router.switch-proxy');
const misc    = require('vi-misc');
const methods = require('./methods');
const Route   = require('./route');
let Router = null;

/**
 * Since this module is imported by Router, require('./router') here returns an empty object.
 * Exports an proxy function to pass Router here. Remember to call this function before using
 * proxy.proxy
 **/
function init(_Router) {
    Router = _Router;
}

const proxy = {

    validateCondition({ method, route }) {
        assert(route instanceof Route, 'Argument route must be an instance of Route');
        debug(`validate [${method}] [${route.path}]`);
        assert(methods.request.includes(method) || methods.special.includes(method),
            `${method} not supported`);
        assert('string' === typeof route.path|| route.path instanceof RegExp,
            `Route path be a string or a regular expression, ${typeof route.path} given`);
        return true;
    },

    validateResult({ handler }) {
        debug('validate router handler');
        assert((handler instanceof Function) || (handler instanceof Router),
            'Handler must be a Function or a Router instance');
        return true;
    },

    /**
     * @param input,  is { request, args, routed, params }
     **/
    match(input, { method, route }, context) {
        debug(`matching ${method} ${route.path}`);

        if (!matchMethod(method, input.request.method, input.routed)) {
            return false;
        }

        const result = route.regexp.exec(input.request.path);
        if (!result) {
            return false;
        }
        debug('match');

        if (route.options.end) {
            input.routed++;
        }

        context.matched = result[0];
        context.params = misc.object.clone(input.params);
        const prefixParamsLength = Object.keys(context.params).length;
        for (let index = 0; index < route.keys.length; index++) {
            let paramName = route.keys[index].name;
            if (Number.isInteger(paramName)) {
                paramName += prefixParamsLength;
            }
            assert(!context.params.hasOwnProperty(paramName), 'Route error, duplicated param name');
            context.params[paramName] = result[index + 1];
        }

        return true;
    },

    async execute({ handler }, { request, args, routed, params }, context) {
        debug('execute');
        params = misc.object.merge({}, params, context.params);
        if (!(handler instanceof Router)) {
            args[0].params = params;
            return await handler(...args);
        }
        /**
         * Nesting to sub-Router
         **/
        request = {
            request: {
                method: request.method,
                path:   request.path.slice(context.matched.length),
            }, args, routed, params,
        };
        return await handler._switcher.dispatch(request);
    }
};


function matchMethod(method, inputMethod, inputRouted) {
    if (method === inputMethod) {
        return true;
    }
    switch (method) {
    case 'ALL':
        return true;
    case 'ROUTED':
        return inputRouted > 0;
    case 'OTHER':
        return inputRouted === 0;
    default:
        return false;
    }
}


module.exports = { init, proxy };
