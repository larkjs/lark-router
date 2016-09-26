'use strict';

exports.get = (ctx, next) => {
    ctx.body = 'Hello, ' + ctx.params.name;
    return next();
};
