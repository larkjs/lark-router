'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default function * (next) {
    const ctx = this;
    debug("Example: GET /_hello");
    ctx.body = 'GET /_hello';
    yield next;
};
