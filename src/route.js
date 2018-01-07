/**
 * Route class in Lark Router, used to represent a certain route
 **/
'use strict';

const assert      = require('assert');
const debug       = require('debug')('lark-router.route');
const misc        = require('vi-misc');
const path2regexp = require('path-to-regexp');

class Route {
    constructor(routePath, options) {
        debug('construct');
        assert(options instanceof Object, 'Invalid options, should be an object');
        this.options = misc.object.clone(options);
        this.path = routePath;
        this.keys = [];
        this.regexp = path2regexp(this.path, this.keys, this.options);
        debug(`route-path: ${this.path}, keys: ${this.keys.map(item => item.name).join(', ')}`);
    }
}

module.exports = Route;
