/**
 * Example of LarkRouter without loading files as routes
 **/
'use strict';

const debug   = require('debug')('lark-router.example.server');
const http    = require('http');

const Router  = require('..');
const httpAdapter = require('../adapter/http');

const mainRouter = new Router();
mainRouter.adapt(httpAdapter);
mainRouter.on('error', (error, req, res) => {
    console.log(error.message);
    res.statusCode = 500;
    res.end(error.message);
});

function response (content, key = null) {
    return (req, res) => {
        debug('responsing ' + req.url + ' ...');
        return new Promise((resolve, reject) => {
            debug('writing data into body ...');
            const data = content + (null === key ? '' : ' ' + req.params[key]);
            console.log(data);
            res.end(data, error => {
                debug('writing data done!');
                if (error) return reject(error);
                return resolve();
            });
        });
    };
}

mainRouter.get('/', response('How are you!'));
mainRouter.POST('/POST', response('Oh, you post it!'));
mainRouter.Get('/hello/haohao', response('Hello, Haohao!'));
mainRouter.options('/', response('/'));
mainRouter.put(/^\/hello\/([a-zA-Z_]+)$/, response('Hello', '$1'));
mainRouter.get('/test/:id(number)/', response('Hello, No.', 'id'));
mainRouter.get('/test/:name(name)/', response('Hello ', 'name'));
mainRouter.routed('/test/:whatever', response('test requested!'));
mainRouter.other('/test/:whatever', response('Hello, anonym'));
mainRouter.get('/error', (req, res) => { throw new Error("Fake"); });
mainRouter.get('/error/async', (req, res) => new Promise((resolve, reject) => reject(new Error("Fake Async"))));
mainRouter.other('*', (req, res) => { res.writeHead(404, 'Not Found'); res.end('Not Found'); });

http.createServer(mainRouter.routes()).listen(3000);
