/**
 * The default Adapter
 **/
'use strict';

const $           = require('lodash');
const debug       = require('debug')('lark-router.adapter.common');
const assert      = require('assert');
const methods     = require('methods');
const path2regexp = require('path-to-regexp');

debug('loading ...');

const adapter = {
    /**
     * Get the methods this app supports
     **/
    get methods () {
        return $.cloneDeep(methods).concat(['all', 'other', 'routed']);
    },
    /**
     *  Preprocess the routing rules, eg. Parse path into regexp
     **/
    get prepare () {
        return prepare;
    },
    /**
     * Maps the original params into objects for matching test
     **/
    get mapping () {
        return mapping;
    },
    get match () {
        return match;
    },
    get params () {
        return params;
    }
};

function prepare (route) {
    let keys = [];
    const regexp = path2regexp(route, keys);
    return { route, regexp, keys };
}

function mapping (...args) {
    const args1 = args[0] || {};
    return {
        method: args1.method || 'get',
        url:    args2.method || '/',
    }
}

function match (info, method, route, routed = false) {
    const matches = route.regexp.exec(info.url);
    if (!matches) return false;
    method = method.toLowerCase();
    switch (true) {
        case method === 'all':
        case routed && method === 'routed':
        case !routed && method === 'other':
        case method === info.method.toLowerCase():
            route.params = matches.slice(1);
            return true;
    }
    return false;
}

function params (route, ctx) {
    const values = $.cloneDeep(route.params);
    const params = {};
    let i = 0;
    for (let key of route.keys) {
        params[key.name] = values[i++];
    }
    for (let i = 0; i < values.length; i++) {
        const name = '$' + (i + 1);
        assert(undefined === params[name], 'You should not define a path param named "' + name + '"');
        params[name] = values[i];
    }
    ctx.params = params;
}

debug('loaded!');
module.exports = adapter;
