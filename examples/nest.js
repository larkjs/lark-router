/**
 * The use of lark-route for nesting use
 **/
'use strict';

const debug   = require('debug')('lark-router.exampels.nest');
const http    = require('http');
const Router  = require('..');

debug('loading ...');

function response (path, send = true) {
    return (req, res) => {
        debug(req.url + ' is requested!');
        debug('route path is ' + path);
        debug('params are ' + JSON.stringify(req.params));
        send && res.end(path + ' matched, content is ' + req.params.content + '\n');
    }
}

const main = new Router();
const api  = new Router().configure({
    methods: [],
    subroutine: 'api_sub',
    'nesting-path-auto-complete': false,
});
const welcome = new Router();
// for test
const other   = new Router().configure({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    subroutine: null,
});
other.subroutine;
const error = new Router();

main.get('/api/:version', api);
main.get('/other', other);

api.get('/', response('/'));
api.get('/foo/:content', response('/foo/:content'));
api.get('/bar/:content', response('/bar/:content'));
api.get('/welcome/:api_sub*/home', welcome);
api.get('/error/:api_sub*', error);

welcome.get('/:content', response('Welcome Haohao'));
welcome.post('/:content', response('Welcome Haohao (POST)'));

other.all('/', api);

error.all('*', () => { throw new Error("Faked Error!"); });

main.get('/api/:version/:content*', response('/api/:version/:content*', false));
main.routed('/api/:version/:content*', response('/api/:version/:content*', false));
main.other('*', response('*'));

main.on('error', (error, req, res) => {
    res.statusCode = 500;
    res.end("Internal Error: " + error.message);
});

module.exports = http.createServer(main.routes()).listen(3000, () => debug("server listening on 3000 ..."));

debug('loaded!');
