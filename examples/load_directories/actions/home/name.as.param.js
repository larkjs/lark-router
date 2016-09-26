'use strict';

const debug   = require('debug')('lark-router.examples.load_directories.actions.home.:name');

debug('loading ...');

module.exports = {
    GET (ctx, next) {
        debug('GET /home/:name');
        ctx.body = 'Welcome home, ' + ctx.params.name + '\n';
        return next();
    }
};

debug('loaded');
