'use strict';

const assert      = require('assert');
const extend      = require('extend');
const path2regexp = require('path-to-regexp');

class Route {
    constructor(route, options = {}) {
        assert('string' === typeof route || route instanceof RegExp, 'Invalid route path');
        this.route = route;
        this.options = extend(true, {}, options);
        this.regexp = path2regexp(this.route, this.options);
        this.keys = this.regexp.keys;
    }
    
    exec(path) {
        return this.regexp.exec(path);
    }
}

module.exports = Route;
