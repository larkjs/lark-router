'use strict';

const debug   = require('debug')('lark-router.examples.load_directories.actions./');
const Router  = require('../../..');

debug('loading ...');

module.exports = {
    GET (ctx, next) {
        ctx.body = 'main';
        return next();
    }
}

debug('load!');
