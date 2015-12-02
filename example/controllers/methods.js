'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default router => {
    router.get('/', function * (next) {
        const ctx = this;
        debug("Example: GET /methods");
        ctx.body = 'GET /methods';
        yield next;
    });
    router.post('/', function * (next) {
        const ctx = this;
        debug("Example: POST /methods");
        ctx.body = 'POST /methods';
        yield next;
    });

    router.put('/', function * (next) {
        const ctx = this;
        debug("Example: PUT /methods");
        ctx.body = 'PUT /methods';
        yield next;
    });

    router.delete('/', function * (next) {
        const ctx = this;
        debug("Example: DELETE /methods");
        ctx.body = 'DELETE /methods';
        yield next;
    });
};
