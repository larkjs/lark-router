'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /foo");
    ctx.body = 'GET /foo';
};
