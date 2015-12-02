/**
 * Example of lark router
 */
'use strict';

import _debug   from 'debug';
import Koa      from 'koa';
import Router   from '..';

const debug = _debug('lark-router');

debug("Example: set main module to example app.js for test");
process.mainModule = module;

// options is exactly the same as default options
const router  = new Router({
    'param_prefix': '_',
    'default': 'index',
}).load('controllers');

router.redirect("/haohao", "/methods");
router.all("*", async (ctx) => {
    debug("Example: router.all " + ctx.method + ' ' + ctx.url);
});

debug("Example: router.routes");
const app     = new Koa();
app.use(router.routes());

debug("Example: app listening");
//export for super test
export default app.listen(3000);
