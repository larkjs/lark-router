/**
 * Created by mdemo on 14/11/13.
 */
var koa = require('koa');
var bootstrap = require('..');
var app = module.exports = koa();



app.use(bootstrap({directory:'example/controllers'}));
app.use(function*(next){
  console.log(123);
  yield  next;
});
app.use(bootstrap({directory:'example/controllers'}));
app.listen(3002);
