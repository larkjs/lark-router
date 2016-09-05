'use strict';

const debug = require('debug')('lark-router.exampels.controllers');

module.exports = router => {
    debug("add route GET /hello/world");
    router.get('/', async (ctx) => {
        debug("GET /hello/world");
        ctx.body = 'GET /hello/world';
    });

    debug("add route POST /hello/world");
    router.post('/post', async (ctx) => {
        debug("POST /hello/world/post");
        ctx.body = 'POST /hello/world/post';
    });
}
