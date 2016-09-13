/**
 * Use in koa apps
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.kao');

const Koa     = require('koa');
const Router  = require('..');

debug('loading ...');

const router = new Router();

router.get('/home/:name', (ctx, next) => {
    debug('GET /home/:name');
    ctx.body = 'Welcome home, ' + ctx.params.name + "\n";
    return next();
});

const app = new Koa();

module.exports = app.use(router.routes()).listen(3000, () => debug('http app starts to listen on 3000 ...'));

debug('loaded!');
