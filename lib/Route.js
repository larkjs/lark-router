'use strict';

const assert      = require('assert');
const extend      = require('extend');
const misc        = require('vi-misc');
const path2regexp = require('path-to-regexp');

class Route {
    constructor(route, options = {}) {
        assert('string' === typeof route || route instanceof RegExp, 'Invalid route path');
        this.route = route;
        this.options = extend(true, {}, options);
        this._loadSimpleRoute() || this._loadCommonRoute();
    }
    // Simple route supports pattern like /:key1/:key2*/:key3?/:key+
    // Simple routes are more often used, and can be test via '==' rather than regexp match,
    // which is much faster
    _loadSimpleRoute() {
        if ('string' !== typeof this.route) {
            return false;
        }
        this.keys = [];
        this.routeItems = [];
        let keys = misc.path.split(this.route);
            //.filter(item => !!item.trim().length);
        for (let key of keys) {
            if (key.match(/^[a-zA-Z0-9_\-]*$/)) {
                this.routeItems.push(key);
                continue;
            }
            let matches = key.match(/^:([a-zA-Z0-9_\-]+)([\*\?\+]?)$/);
            if (!matches) {
                return false;
            }
            this.routeItems.push({ suffix: matches[2] || null });
            this.keys.push({
                name: matches[1],
            });
        }
        if (this.options.end === false) {
            this.routeItems.push({ suffix: '*' });
        }
        delete this.regexp;
        return true;
    }
    _loadCommonRoute() {
        this.regexp = path2regexp(this.route, this.options);
        this.keys = this.regexp.keys;
        return true;
    }
    exec(path) {
        if (this.regexp) {
            return this.regexp.exec(path);
        }
        let items = misc.path.split(path);
            //.filter(item => !!item.trim().length);
        let result = match(items, extend(true, [], this.routeItems), extend(true, {}, this.keys));
        if (!result) {
            return null;
        }
        if (this.options.end === false) {
            result.next = result.path.pop();
            result.keys.pop();
        }
        result = [result.path.join('/'), ...result.keys];
        return result;
    }
}

function match(items, routeItems) {
    let result = {
        path: [],
        keys: [],
    };


    if (routeItems.length === 0) {
        return items.length === 0 ? result : false;
    }

    let routeItem = routeItems.shift();
    if ('string' === typeof routeItem) {
        let item = items.shift();
        result = routeItem === item ? match(items, routeItems) : false;
        result && result.path.unshift(item);
    }
    else {
        let value = [];
        let count = 0;

        let matches = false;
        do {
            if (count > 1 && (['*', '+'].includes(routeItem.suffix))) {
                matches = match(items, routeItems);
            }
            else if (count === 1 && (['*', '?', null].includes(routeItem.suffix))) {
                matches = match(items, routeItems);
            }
            else if (count === 0 && (['*', '?'].includes(routeItem.suffix))) {
                matches = match(items, routeItems);
            }
            !matches && value.push(items.shift());
            count++;
        } while(!matches);
        value = value.join('/');
        result = matches;
        if (result !== false) {
            result.path.unshift(value);
            result.keys.unshift(value);
        }
    }
    return result;
}

module.exports = Route;
