/**
 * The default configs for http apps
 **/
'use strict';

const $           = require('lodash');
const debug       = require('debug')('lark-router.adapter.http');
const assert      = require('assert');

const adapter = require('./base');

debug('loading ...');

const httpAdapter = $.assign({
    get mapping () {
        return mapping;
    }
}, adapter);

function mapping (req, res) {
    return {
        method: req.method,
        url:    req.url.split('?')[0],
    };
}

debug('loaded!');
module.exports = httpAdapter;
