'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

exports.GET = async (ctx) => {
    debug("GET /");
    ctx.body = 'GET /';
};
