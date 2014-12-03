lark-koa-bootstrap
=============

A bootstrap koa middleware for [lark.js](https://github.com/larkjs/lark). 

[![NPM version][npm-image]][npm-url]
  
  
## Installation

```
$ npm install lark-koa-bootstrap
```

### API
#### `app.use(bootstrap(options))`

```javascript
var koa = require('koa');
var bootstrap = require('lark-koa-bootstrap');
var app = koa();

app.use(bootstrap({directory:'controllers'}));

app.listen(3002);
```




#### directory
The `directory` configuration option (optional) is the path to a directory.
Specify a directory to have lark-koa-bootstrap scan all files recursively to find files
that match the controller-spec API. With this API, the directory structure
dictates the paths at which handlers will be mounted.

```text
controllers
 |-user
     |-create.js
     |-list.js
 |-product
     |-index.js
```
```javascript
// create.js
module.exports = function(router){
  router.get('/', function *(){
    this.body = 'Hello koa';
  });
  return router;
};
```
```javascript
app.use(bootstrap({
    directory: 'controllers'
}));
```
Routes are now:
```test
/user/create
/user/list
/product
```
  
[npm-image]: https://img.shields.io/npm/v/lark-koa-bootstrap.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-koa-bootstrap
