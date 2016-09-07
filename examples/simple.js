/**
 * The simple use of lark-router
 **/
'use strict';

const debug = require('debug')('lark-router.examples.simple');
const Router = require('..');

debug('loading ...');

const router = new Router();
router.match = (condition, target, o) => {
    if (o.routed || target > condition) return false;
    o.routed = true;
    return true;
};

router.route(3,   age => console.log(age + ' years old, less than 3 years old'));
router.route(18,  age => console.log(age + ' years old, less than 18 years old boy'));
router.route(30,  age => console.log(age + ' years old, less than 30 years old boy'));
router.route(55,  age => console.log(age + ' years old, less than 55 years old boy'));

for (let i = 1; i <= 80; i += parseInt(Math.random() * 10, 10)) {
    router.dispatch(i, {});
}

debug('loaded!');
