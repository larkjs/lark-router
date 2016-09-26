/**
 * The use of async handlers
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.async');
const http    = require('http');
const Router  = require('..');

debug('loading ...');

const router = new Router();

router.get('/foo', (req, res) => {
    debug('foo - 1');
    res.body = [Date.now()];
});
router.get('/foo', (req, res) => new Promise((resolve, reject) => {
    setTimeout(() => {
        debug('foo - 2');
        res.body.push(Date.now());
        resolve();
    }, 1000);
}));
router.get('/foo', (req, res) => new Promise((resolve, reject) => {
    setTimeout(() => {
        debug('foo - 3');
        res.body.push(Date.now());
        res.end(res.body.join(', ') + '\n', () => {
            resolve();
        });
    }, 500);
}));

router.get('/bar', (req, res) => new Promise((resolve, reject) => {
    setTimeout(() => {
        debug('bar - 1');
        res.body = [Date.now()];
        resolve();
    }, 500);
}));
router.get('/bar', (req, res) => {
    debug('bar - 2');
    res.body.push(Date.now());
});
router.get('/bar', (req, res) => new Promise((resolve, reject) => {
    setTimeout(() => {
        debug('bar - 3');
        res.body.push(Date.now());
        res.end(res.body.join(', ') + '\n', () => {
            resolve();
        });
    }, 1000);
}));

module.exports = http.createServer(router.routes()).listen(3000, () => debug('async http apps listening on 3000 ...'));
