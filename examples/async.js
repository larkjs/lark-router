/**
 * The use of async handlers
 **/
'use strict';

const debug = require('debug')('lark-router.examples.async');
const Router = require('..');

debug('loading ...');

const router = new Router();

router.route(1, () => console.log(1));
router.route(1, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(2);
        resolve();
    }, 1000);
}));
router.route(1, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(3);
        resolve();
    }, 500);
}));
router.route(2, () => console.log(4));
router.route(2, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(5);
        resolve();
    }, 1000);
}));
router.route(2, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(6);
        resolve();
    }, 500);
}));

// router.dispatch(1);
router.dispatch(2);
