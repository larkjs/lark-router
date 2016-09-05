/**
 * The default configs for http apps
 **/
'use strict';

const debug   = require('debug')('lark-router.config.http');

debug('loading ...');

module.exports = {
    get routing () {
        return (req, res, next) => {
            return {
                method: req.method,
                url:    req.url,
            };
        }
    }
}

debug('loaded!');
