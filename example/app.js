/**
 * Example of lark router
 */
'use strict';

import _debug   from 'debug';
import convert  from 'koa-convert';
import Koa      from 'koa';
import Router   from '..';

const debug = _debug('lark-router');

debug("Example: set main module to example app.js for test");
process.mainModule = module;

const app     = new Koa();

// options is exactly the same as default options
const router  = new Router('controllers', {
    'param_prefix': '_',
    'default': 'index',
});

debug("Example: router.routes");
app.use(convert(router.routes()));

debug("Example: app listening");
app.listen(3000);
