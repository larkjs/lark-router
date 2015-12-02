'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default router => {
    debug("Example: add route GET /hello/world");
    router.get('/', async (ctx) => {
        debug("Example: GET /hello/world");
        ctx.body = 'GET /hello/world';
    });

    debug("Example: add route POST /hello/world");
    router.post('/post', async (ctx) => {
        debug("Example: POST /hello/world/post");
        ctx.body = 'POST /hello/world/post';
    });
}
