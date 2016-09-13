/**
 * The use of lark-route for mounting use
 **/
'use strict';

const debug   = require('debug')('lark-router.exampels.http');
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
const api  = new Router({
    subroutine: 'api_sub',
});
const welcome = new Router();

main.get('/api/:version/:subroutine*', api);

api.get('/', response('/'));
api.get('/foo/:content', response('/foo/:content'));
api.get('/bar/:content', response('/bar/:content'));
api.get('/welcome/:api_sub*', welcome);

welcome.get('/:content', response('Welcome Haohao'));
welcome.post('/:content', response('Welcome Haohao (POST)'));

main.get('/api/:version/:content*', response('/api/:version/:content*', false));
main.routed('/api/:version/:content*', response('/api/:version/:content*', false));
main.other('*', response('*'));

/* for errors
main.on('error', error => debug('Main:' + error.stack));
api.on('error', error => debug('API:' + error.stack));
welcome.on('error', error => debug('Welcome:' + error.stack));
*/

module.exports = http.createServer(main.routes()).listen(3000, () => debug("server listening on 3000 ..."));

debug('loaded!');
