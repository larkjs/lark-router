/**
 * The default configs for http apps
 **/
'use strict';

const debug   = require('debug')('lark-router.config.http');

debug('loading ...');

module.exports = {
    get routing () {
        return (ctx, next) => {
            return {
                method: ctx.method,
                url:    ctx.url,
            };
        }
    }
}

debug('loaded!');
