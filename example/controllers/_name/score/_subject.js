'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /:name/score/:subject");
    ctx.body = 'GET /:name/score/:subject';
};
