'use strict';

const debug   = require('debug')('lark-router.examples.load_directories.actions.api.:path*');

debug('loading ...');

module.exports = {
    GET (ctx, next) {
        debug('GET /api/:path*');
        ctx.body = 'You have requested api ' + ctx.params.path + '\n';
        return next();
    }
};

debug('loaded');
