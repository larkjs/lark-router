'use strict';

const debug = require('debug')('lark-router.examples.load_directories.hello');

debug('loading ...');

module.exports = {
    Get (ctx, next) {
        debug('GET /hello');
        ctx.body = 'Hello, How are you?\n';
        return next();
    },
    Post (ctx, next) {
        debug('POST /hello');
        ctx.body = 'Hello, Thank you for your postings\n';
        return next();
    },
    Other (ctx, next) {
        debug('OTHER /hello');
        ctx.body = 'Hello, What can I do for you?\n';
        return next();
    }
};

debug('load!');
