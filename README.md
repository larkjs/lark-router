koa-enrouten
=============

Route configuration middleware for koajs.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
  
  
## Installation

```
$ npm install koa-enrouten
```

### API
#### `app.use(enrouten(options))`

```javascript
var koa = require('koa');
var enrouten = require('koa-enrouten');
var app = koa();

app.use(enrouten({directory:'controllers'}));

app.listen(3002);
```




#### directory
The `directory` configuration option (optional) is the path to a directory.
Specify a directory to have enrouten scan all files recursively to find files
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
  router.get('/', function *(next){
    this.body = 'Hello koa';
    yield next;
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

## Tests
  
```
npm test
```
  
  
[npm-image]: https://img.shields.io/npm/v/koa-enrouten.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-enrouten
[travis-image]: https://img.shields.io/travis/larkjs/koa-enrouten/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/koa-enrouten
