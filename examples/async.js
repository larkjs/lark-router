/**
 * The use of async handlers
 **/
'use strict';

const debug   = require('debug')('lark-router.examples.async');
const http    = require('http');
const Router  = require('..');

debug('loading ...');

const router = new Router();

router.get('/foo', () => console.log('foo - 1'));
router.get('/foo', (req, res) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('foo - 2');
        res.end("foo", error => {
            if (error) return reject(error);
            resolve();
        });
    }, 1000);
}));
router.get('/foo', () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('foo - 3');
        resolve();
    }, 500);
}));
router.get('/bar', (req, res) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('bar - 1');
        res.end("bar", error => {
            if (error) return reject(error);
            resolve();
        });
    }, 1000);
}));
router.get('/bar', () => console.log('bar - 2'));
router.get('/bar', () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('bar - 3');
        resolve();
    }, 500);
}));

http.createServer(router.routes()).listen(3000, () => console.log('server listening on 3000 ...'));
