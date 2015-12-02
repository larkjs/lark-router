'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default router  => {
    router.get('/', function * (next) {
        const ctx = this;
        debug("Example: GET /foo");
        ctx.body = 'GET /foo';
        yield next;
    });
};
