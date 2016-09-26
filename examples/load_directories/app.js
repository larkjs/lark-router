/**
 * Example of loading files as router
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.app');
const path    = require('path');

const Koa     = require('koa');
const Router  = require('../..');

debug('loading ...');

const router = new Router();

router.load(path.join(__dirname, 'actions'));

router.on('error', (error, ctx) => {
    debug('ROUTER ERROR');
    return ctx.throw(error);
});

const app = new Koa();
app.on('error', (error, ctx) => {
    debug('APP ERROR');
});

module.exports = app.use(router.routes()).listen(4100, () => debug('koa apps listening on 4100 ...'));

debug('loaded!');
