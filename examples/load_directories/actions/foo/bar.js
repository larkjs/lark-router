'use strict';

const debug = require('debug')('lark-rotuer.examples.load_directories.foo.bar');

debug('loading ...');

module.exports = {
    GET (ctx, next) {
        debug('GET /foo/bar');
        ctx.body = 'Foo Bar\n';
        return next();
    }
}
