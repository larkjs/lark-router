/**
 * The use of lark-route for methods
 **/
'use strict';

const debug   = require('debug')('lark-router.exampels.http');
const http    = require('http');
const Router  = require('..');

debug('loading ...');

const router = new Router();

router.GET('/welcome', (req, res) => {
    res.end('You are welcome!\n');
});
router.Get('/home/:name', (req, res) => {
    res.end('Welcome home, ' + req.params.name + "\n");
});
router.get('/home/:name/:page', (req, res) => {
    res.end('Welcome to page ' + req.params.$2 +', ' + req.params.name + "\n");
});
router.post('/home/:name/:page', (req, res) => {
    res.end('Thank you for posting on page ' + req.params.$2 +', ' + req.params.name + "\n");
});

http.createServer(router.routes()).listen(3000, () => console.log("server listening on 3000 ..."));

debug('loaded!');
