/**
 * The example of using lark-router on a Koa App
 **/
'use strict';
process.mainModule = module;

const Koa     = require('koa');
const Router  = require('lark-router');

const router = new Router();

router.get('/home/:name', async (ctx, next) => {
    ctx.body = `Welcome home, ${ctx.params.name}`;
    await next();
});
router.post('/home/:name/:action', async (ctx, next) => {
    ctx.body = `You have posted an action "${ctx.params.action}" to ${ctx.params.name}`;
    await next();
});
/*
router.get('/home1/:name/:action', async (ctx, next) => {
    ctx.body = `You have posted an action "${ctx.params.action}" to ${ctx.params.name}`;
    await next();
});
router.get('/home2/:name/:action', async (ctx, next) => {
    ctx.body = `You have posted an action "${ctx.params.action}" to ${ctx.params.name}`;
    await next();
});
router.get('/home3/:name/:action', async (ctx, next) => {
    ctx.body = `You have posted an action "${ctx.params.action}" to ${ctx.params.name}`;
    await next();
});
router.post('/home4/:name/:action', async (ctx, next) => {
    ctx.body = `You have posted an action "${ctx.params.action}" to ${ctx.params.name}`;
    await next();
});
*/

const router2 = new Router();
router2.get('/foo/:bar', async (ctx, next) => {
    let message = ctx.params.bar;
    if (ctx.params.prefix) {
        message = ctx.params.prefix + ':' + message;
    }
    ctx.body = `Foo - Bar = ${message}`;
    await next();
});

router.get('/2', router2);
router.get('/2/:prefix', router2);

router.get('/welcome/:name', async (ctx, next) => {
    ctx.body = `Welcome, ${ctx.params.name} `;
    await next();
});
router.routed('/welcome/*', async (ctx) => {
    ctx.body += '[Routed]';
});
router.other('/welcome/*', async (ctx, next) => {
    ctx.body = 'Not matched ';
    await next();
});

router.all('/welcome/*', async (ctx) => {
    ctx.body += '[All]';
});

router.get(/^\/regexp\/(\d+)$/, async (ctx, next) => {
    ctx.body = `input is ${ctx.params['0']}`;
    await next();
});

const app = new Koa();

app.use(router.routes());
module.exports = app.listen(3000);

