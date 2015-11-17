'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default async (ctx) => {
    debug("Example: GET /_hello");
    ctx.body = 'GET /_hello';
};
