/**
 * Example of file router
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.load_files.func');

debug('loading ...');

module.exports = router => {
    debug('setting router as common use ...');

    router.get('/', (ctx, next) => {
        ctx.body = 'func GET /\n';
        return next();
    });

    router.get('/welcome', (ctx, next) => {
        ctx.body = 'func GET /welcome\n';
        return next();
    });
};

debug('loaded!');
