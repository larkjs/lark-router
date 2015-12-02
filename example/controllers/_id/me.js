'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export const GET = async (ctx) => {
    debug("Example: GET /:id/me");
    ctx.body = 'GET /:id/me';
};
