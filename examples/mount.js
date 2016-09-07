/**
 * The use of lark-route for mounting use
 **/
'use strict';

const debug   = require('debug')('lark-router.exampels.http');
const http    = require('http');
const Router  = require('..');

debug('loading ...');

const main  = new Router();
const api   = new Router();
const foo   = new Router();
const bar   = new Router();

main.get('/api/:version/:subroutine*', api);

api.get('/foo/:subroutine*', foo);
api.get('/bar/:subroutine*', bar);

foo.get('/:whatever*', (req, res) => {
    console.log('foo requested! v=' + req.params.version);
    res.end('foo');
});

bar.get('/:whatever*', (req, res) => {
    console.log('bar requested! v=' + req.params.version);
    res.end('bar');
});

http.createServer(main.routes()).listen(3000, () => console.log("server listening on 3000 ..."));

debug('loaded!');
