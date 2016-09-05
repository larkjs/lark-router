/**
 * Example of LarkRouter without loading files as routes
 **/
'use strict';

const debug   = require('debug')('lark-router.example.server');
const Koa     = require('koa');

const Router  = require('..');
const koaAdapter = require('../adapter/koa');

const mainRouter = new Router();
mainRouter.adapt(koaAdapter);
mainRouter.on('error', (error, ctx) => {
    console.log(error.message);
    ctx.statusCode = 500;
    ctx.body = error.message;
});

function response (content, key = null) {
    return (ctx, next) => {
        debug('responsing ' + ctx.url + ' ...');
        return next().then(() => {
            const data = content + (null === key ? '' : ' ' + ctx.params[key]);
            ctx.body = data;
            debug('responsing done!');
        });
    };
}

mainRouter.get('/', response('How are you!'));
mainRouter.POST('/POST', response('Oh, you post it!'));
mainRouter.Get('/hello/haohao', response('Hello, Haohao!'));
mainRouter.options('/', response('/'));
mainRouter.put(/^\/hello\/([a-zA-Z_]+)$/, response('Hello', '$1'));
mainRouter.get('/test/:id(\\d+)/', response('Hello, No.', 'id'));
mainRouter.get('/test/:name([a-zA-Z_]+)/', response('Hello ', 'name'));
mainRouter.routed('/test/:whatever', () => console.log('test requested!'));
mainRouter.other('/test/:whatever', response('Hello, anonym'));
mainRouter.get('/error', (ctx, next) => { throw new Error("Fake"); });
mainRouter.get('/error/async', (ctx, next) => new Promise((resolve, reject) => reject(new Error("Fake Async"))));
mainRouter.other('*', (ctx, next) => { res.writeHead(404, 'Not Found'); res.end('Not Found'); });

const app = new Koa();
app.use(mainRouter.routes()).listen(3000);
