/**
 * Example of load
 **/
'use strict';

const debug = require('debug')('lark-router.examples.load');
const Router = require('../..');

debug('loading ...');

const router = new Router();

router.load('test.js')

debug('laoded!');
