'use strict';

exports.get = (ctx, next) => {
    ctx.body = 'Hello';
    return next();
};
