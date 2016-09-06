/**
 * Lark Router
 **/
'use strict';

const $       = require('lodash');
const debug   = require('debug')('lark-router');
const assert  = require('assert');

const EventEmitter  = require('events').EventEmitter;

debug('loading ...');

class Router extends EventEmitter {
    constructor () {
        super();
        this._routes = [];
    }
    /**
     * Set the route rules
     **/
    route (condition, result) {
        debug('setting route ...');
        assert(undefined !== condition, 'Condition should not be undefined!');
        assert(Array.isArray(this._routes), 'Internal Error, [Router] router._routes should be an Array!');
        this._routes.push({ condition, result });
    }
    /**
     * Switch the target, returns the list of results
     **/
    switch (...args) {
        debug('switching ...');
        assert(this.match instanceof Function, 'Route matching tester should be a Function');
        const results = [];
        for (const route of this._routes) {
            if (this.match($.cloneDeep(route.condition), ...args)) {
                debug('condition matched!');
                let result = route.result;
                if (result instanceof Router) {
                    result = result.switch(...args);
                    results.push(...result);
                }
                else {
                    results.push(result);
                }
            }
        }
        return results;
    }
    dispatch (...args) {
        debug('dispatching ...');
        const results = this.switch(...args);
        let promise = new Promise(resolve => resolve());
        for (let result of results) {
            promise = promise.then(() => {
                return this.execute(result, ...args);
            });
        }
        return promise;
    }
    //=================adapters===================//
    match (condition, ...args) {
        const target = args[0];
        return target === condition;
    }
    execute (result, ...args) {
        debug('executing ...');
        assert(result instanceof Function, 'Result to execute should be a Function');
        return result(...args);
    }
}

module.exports = Router;
debug('loaded');
