'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export const get = async (ctx) => {
    debug("Example: GET /methods");
    ctx.body = 'GET /methods';
};

export const post = async (ctx) => {
    debug("Example: POST /methods");
    ctx.body = 'POST /methods';
};

export const put = async (ctx) => {
    debug("Example: PUT /methods");
    ctx.body = 'PUT /methods';
};
