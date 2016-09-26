/**
 * The use of lark-route for http apps
 **/
'use strict';

const debug   = require('debug')('lark-router.exampels.http');
const http    = require('http');
const Router  = require('..');

debug('loading ...');

const router = new Router({
    max: 1,
});

router.route('GET', '/welcome', (req, res) => {
    debug('GET /welcome');
    res.end('You are welcome!\n');
});
router.get('/hello/world', (req, res) => {
    debug('GET /hello/world');
    res.end('Hello World!\n');
});
router.get(/^\/home\/(\d+)$/, (req, res) => {
    debug('GET /^\\/home\\/(\\d+)$/');
    res.end('Welcome home, No.' + req.params[0] + "\n");
});
router.get('/home/:name', (req, res) => {
    debug('GET /home/:name');
    res.end('Welcome home, ' + req.params.name + "\n");
});
router.get('/home/:name/:page', (req, res) => {
    debug('GET /home/:name/:page');
    res.end('Welcome to page <' + req.params.page +'> by ' + req.params.name + "\n");
});
router.post('/home/:name/:page', (req, res) => {
    debug('POST /home/:name/:page');
    res.end('Thank you for posting page <' + req.params.page +'>, ' + req.params.name + "\n");
});
router.route('GET', '/crash', (req, res) => {
    debug('GET /crash');
    throw new Error("Faked Error!");
});
router.route('GET', '/clear', (req, res) => {
    debug('GET /clear');
    router.clear();
    res.end("cleared!\n");
});
router.route('OTHER', '*', (req, res) => {
    debug('OTHER *');
    res.statusCode = 404;
    res.end('Not Found\n');
});
router.on('error', (error, req, res) => {
    debug('error emitted');
    res.statusCode = 500;
    res.end('Internal Error!\n');
});

module.exports = http.createServer(router.routes()).listen(3000, () => debug('http app starts to listen on 3000 ...'));

debug('loaded!');
