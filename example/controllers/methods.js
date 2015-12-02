'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export const GET = async (ctx) => {
    debug("Example: GET /methods");
    ctx.body = 'GET /methods';
};

export const POST = async (ctx) => {
    debug("Example: POST /methods");
    ctx.body = 'POST /methods';
};

export const PUT = async (ctx) => {
    debug("Example: PUT /methods");
    ctx.body = 'PUT /methods';
};

export const DELETE = async (ctx) => {
    debug("Example: DELETE /methods");
    ctx.body = 'DELETE /methods';
};
