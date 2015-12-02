lark-router
=============

Router for lark based on koa 1.x

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

This is for old versions of lark based on Koa 1.x

## Installation

```
$ npm install lark-router@~0.5.0
```

## API
### `app.use(router('controllers'))`

Exmaple:

```
var Koa = require('koa');
var router = require('lark-router');

var app = new Koa();

app.use(router({
    directory: 'controllers'
}));

app.listen(3000);
```

## load

### routes

The directory configuration option (optional) is the path to a directory. Specify a directory to have lark-router scan all files recursively to find files that match the controller-spec API. With this API, the directory structure dictates the paths at which handlers will be mounted.

This is how file paths is converted into routes (with default options: `{ default: 'index.js', param_prefix: '_'}`)

```
directory
  ├─ index.js         => /
  ├─ hello/
  │     └─ world.js   => /hello/world
  └─ _category/
        └─ _title.js  => /:category/:title
```

#### methods

Methods should be defined in those js files, exported as verb properties. We recommand you use verbs in upper case to avoid using reserved words such as `delete`.

```
/**
 * @file: hello/world.js
 **/
 
exports.GET = function * (next) {
    // handle requests on GET /hello/world
}

exports.DELETE = function * (next) {
    // handle requests on DELETE /hello/world
}

```

or use `router` directly by exporting a function

```
/**
 * @file: hello/world.js
 **/

module.exports = function (router) {
    router.get('/', function * (next) => {
        // handle requests on GET /hello/world
    }
    router.get('/:foo/:bar', function * (next) => {
        // handle requests on GET /hello/world/:foo/:bar
    }
}

```

## Tests
  
```
npm test
```
  
  
[npm-image]: https://img.shields.io/npm/v/lark-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-router
[travis-image]: https://img.shields.io/travis/larkjs/lark-router/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-router
