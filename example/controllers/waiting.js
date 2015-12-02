'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default function * (next) {
    const ctx = this;
    debug("Example: GET /waiting");
    const seconds = parseInt(ctx.query.time) * 1000 || 2000;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            ctx.body = 'GET /waiting';
            resolve();
        }, seconds);
    });
};
