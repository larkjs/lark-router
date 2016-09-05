'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /foo/bar");    
    ctx.body = 'GET /foo/bar';
};
