'use strict';

const debug = require('debug')('lark-router.examples.load_directories.error');

debug('loading ...');

module.exports = {
    Get (ctx, next) {
        throw new Error("Faked Error!");
    }
}

debug('loaded');
