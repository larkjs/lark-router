'use strict';
  
const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /methods");
    ctx.body = 'GET /methods';
};

exports.POST = * (ctx) => {
    debug("POST /methods");
    ctx.body = 'POST /methods';
};

exports.PUT = * (ctx) => {
    debug("PUT /methods");
    ctx.body = 'PUT /methods';
};

exports.DELETE = * (ctx) => {
    debug("DELETE /methods");
    ctx.body = 'DELETE /methods';
};
