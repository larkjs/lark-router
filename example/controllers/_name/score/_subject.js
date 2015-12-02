'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default router => {
    router.get('/', function * (next) {
        const ctx = this;
        debug("Example: GET /:name/score/:subject");
        ctx.body = 'GET /:name/score/:subject';
        yield next;
    });
};
