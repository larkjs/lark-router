'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /_hello");
    ctx.body = 'GET /_hello';
};
