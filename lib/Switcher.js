/**
 * Route switcher
 **/
'use strict';

const assert        = require('assert');
const extend        = require('extend');
const Switcher      = require('switch-case');

const methods       = require('./methods');

class RouterSwitcher extends Switcher {
    match(condition, context) {
        const method = context.request.method;
        if (!methods.request.includes(method)) {
            return false;
        }

        if (methods.request.includes(condition.method) && method !== condition.method) {
            return false;
        }

        if ((condition.method === 'ROUTED' && !context.routed) ||
            (condition.method === 'OTHER' && context.routed)) {
            return false;
        }

        const match = condition.route.exec(context.request.path);
        if (!match) {
            return false;
        }

        context.routed++;
        context.params = context.superParams || {};
        context.matched = match[0];
        const keys = condition.route.keys;
        let length = Object.keys(context.params).length;
        let i = 1;

        for (let key of keys) {
            const name = 'number' === typeof key.name ? length + key.name : key.name;
            assert(!context.params.hasOwnProperty(name), `Duplicated route param name ${name}`);
            context.params[name] = match[i++];
        }

        return true;
    }

    nesting(context) {
        context.routed--;
        context = extend({}, context, true);
        context.superParams = extend({}, context.params, true);
        delete context.params;
        context.request = extend({}, context.request, true);
        context.request.path = context.request.path.slice(context.matched.length);
        return context;
    }

    execute(result, context) {
        const args = context.args;
        const request = args[0];
        request.routed = context.routed;
        request.params = extend({}, context.params, true);
        return result(...args);
    }
}

module.exports = RouterSwitcher;
