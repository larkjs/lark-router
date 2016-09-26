/**
 * Example of loading files as router
 **/
'use strict';

const $       = require('lodash');
const debug   = require('debug')('lark-router.examples.app');
const path    = require('path');

const Koa     = require('koa');
const Router  = require('../..');

debug('loading ...');

const router = new Router();

router.adapter.parseFileName = (filename) => {
    if (filename === $.capitalize(filename)) {
        return ':' + filename.toLowerCase();
    }
    return;
}

router.load(path.join(__dirname, 'actions'));

const app = new Koa();

module.exports = app.use(router.routes()).listen(4200, () => debug('koa apps listening on 4200 ...'));

debug('loaded!');
