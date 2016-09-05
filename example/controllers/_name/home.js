'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /:name/home");
    ctx.body = 'GET /:name/home';
};
