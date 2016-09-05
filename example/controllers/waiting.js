'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = * (ctx) => {
    debug("GET /waiting");
    const seconds = parseInt(ctx.query.time) * 1000 || 2000;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            ctx.body = 'GET /waiting';
            resolve();
        }, seconds);
    });
};
