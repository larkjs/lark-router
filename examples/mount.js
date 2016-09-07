/**
 * The use of mounting
 **/
'use strict';

const debug = require('debug')('lark-router.examples.mount');
const Router = require('..');

debug('loading ...');

const mainRouter = new Router();
const subRouter  = new Router();

mainRouter.match = (condition, target) => {
    return target.toString()[0] === condition.toString();
};

subRouter.match = (condition, target) => {
    return target.toString()[1] === condition.toString();
};

mainRouter.route(1, target => console.log('m1    ' + target));
mainRouter.route(2, subRouter);

subRouter.route(1, target => console.log('s1    ' + target));
subRouter.route(2, target => console.log('s2    ' + target));

mainRouter.dispatch(1);
mainRouter.dispatch(11);
mainRouter.dispatch(12);
mainRouter.dispatch(2);
mainRouter.dispatch(21);
mainRouter.dispatch(22);

debug('loaded!');
