'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default function * (next) {
    const ctx = this;
    debug("Example: GET /");
    ctx.body = 'GET /';
    yield next;
};
