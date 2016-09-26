/**
 * Example of file router
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.load_files.obj');

debug('loading ...');

module.exports = {
    GET (ctx, next) {
        ctx.body = 'obj GET /\n';
        return next();
    },
    POST (ctx, next) {
        ctx.body = 'obj POST /\n';
    },
    DELETE (ctx, next) {
        throw new Error('Faked Error for DETELE /');
    }
};

debug('loaded!');
