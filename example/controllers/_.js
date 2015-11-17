'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default async (ctx) => {
    debug("Example: GET /_");
    ctx.body = 'GET /_';
};
