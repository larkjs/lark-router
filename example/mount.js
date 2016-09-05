/**
 * Example of LarkRouters' mounting
 **/
'use strict';

const debug   = require('lark-router.example.server');
const http    = require('http');

debug('loading ...');

const Router  = require('..');

const mainRouter = new Router();
mainRouter.get('/', ctx => ctx.res.end('How are you!'));

const subRouter = new Router();
subRouter.get('/hello', ctx => ctx.res.end('Welcome to the sub router!'));
mainRouter.all('/sub', subRouter);

const deeperSubRouter = new Router();
deeperSubRouter.get('/:name', ctx => ctx.res.end('Your name is ' + name));
subRouter.get('/home', deeperSubRouter);

/**
 * Router's mounting should work correctly, and independently
 **/
http.createServer(mainRouter.routes()).listen(3000);
http.createServer(subRouter.routes()).listen(3001);

debug('loaded!');
