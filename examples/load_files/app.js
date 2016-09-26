/**
 * Example of load
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.load_files');
const Koa     = require('koa');
const Router  = require('../..');

debug('loading ...');
process.mainModule = module;

const main = new Router();
const funcRouter    = new Router().load('func.js');
const customRouter  = new Router().load('custom.js');
const objRouter     = new Router().load('obj.js');

main.all('/func', funcRouter);
main.all('/custom', customRouter);
main.all('/obj',  objRouter);

main.on('error', (error, ctx) => {
    debug('ROUTER ERROR');
    return ctx.throw(error);
});

const app = new Koa();
app.on('error', (error, ctx) => {
    debug('APP ERROR');
});
module.exports = app.use(main.routes()).listen(4000, () => debug('koa server listening on 4000 ...'));

debug('laoded!');
