'use strict';

const debug = require('debug')('lark-router.examples.app.actions.hello');

exports.get = (ctx, next) => {
    ctx.body = 'Hello, How are you?';
    return next();
};
