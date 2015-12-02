'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default router => {
    debug("Example: add route GET /hello/world");
    router.get('/', function * (next) {
        const ctx = this;
        debug("Example: GET /hello/world");
        ctx.body = 'GET /hello/world';
        yield next;
    });

    debug("Example: add route POST /hello/world");
    router.post('/post', function * (next) {
        const ctx = this;
        debug("Example: POST /hello/world/post");
        ctx.body = 'POST /hello/world/post';
        yield next;
    });
}
