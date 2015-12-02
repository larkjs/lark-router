'use strict';

import _debug   from 'debug';
const debug = _debug('lark-router');

export default router => {
    router.get('/', function * (next) {
        const ctx = this;
        debug("Example: GET /foo/bar");    
        ctx.body = 'GET /foo/bar';
        yield next;
    });
};
