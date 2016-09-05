/**
 * Example of lark router
 */
'use strict';
process.mainModule = module;

const debug       = require('lark-router.examples');
const http        = require('http');
const LarkRouter  = require('..');

debug('loadding ...');

// options is exactly the same as default options
const router  = new Router({
    'param_prefix': '_',
    'default': 'index',
}).load('controllers');

router.redirect("/haohao", "/methods");
router.all("*", async (ctx) => {
    debug("router.all " + ctx.method + ' ' + ctx.url);
});

debug("router.routes");
router.parser = (req, res) => {
    return {
        method: req.method,
        url:    req.url,
        ctx:    {req, res},
    }
};
const app = http.createServer(router.routes());

debug("app listening");
//export for super test
module.exports = app.listen(3000);
