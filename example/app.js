/**
 * Created by mdemo on 14/11/13.
 */

//To work around mocha test
process.mainModule = module;

var koa = require('koa');
var router = require('..');
var app = module.exports = koa();

app.use(router({directory:'controllers'}));
app.use(function*(next){
  console.log(123);
  yield  next;
});
app.use(router({directory:'controllers'}));
app.listen(3002);
