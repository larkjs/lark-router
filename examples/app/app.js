/**
 * Example of loading files as router
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.app');
const Koa     = require('koa');
const Router  = require('../..');

debug('loading ...');

const router = new Router();

router.load('actions').on('error', error => console.log(error.stack));

const app = new Koa();

app.use((ctx, next) => {
        console.log(ctx.url);
        return next();
    })
   .use(router.routes())
   .listen(3000, () => debug('koa apps listening on 3000 ...'));

debug('loaded!');
