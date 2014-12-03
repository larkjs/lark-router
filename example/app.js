/**
 * Created by mdemo on 14/11/13.
 */
var koa = require('koa');
var bootstrap = require('..');
var app = module.exports = koa();

app.use(bootstrap({directory:'controllers'}));

app.listen(3002);
