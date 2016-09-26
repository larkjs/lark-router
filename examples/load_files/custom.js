/**
 * Example of file router
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.load_files.custom');
const Router  = require('../..');

debug('loading ...');

module.exports = () => {
    debug('setting router with a new Router ...');

    const router = new Router();

    router.get('/', (ctx, next) => {
        ctx.body = 'custom GET /\n';
        return next();
    });

    router.get('/welcome', (ctx, next) => {
        ctx.body = 'custom GET /welcome\n';
        return next();
    });

    return router;
};

debug('loaded!');
