lark-router
=============

Router for lark based on koa 2.0

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
  
  
## Installation

```
$ npm install lark-router@~1.0.0
```

## API
`app.use(new Router().load('controllers').routes())`

Exmaple:

```
import Koa    from 'koa';
import Router from 'lark-router';

const router = new Router().load('controllers');

const app = new Koa();

app.use(router.routes());

app.listen(3000);
```

## load

### routes

`lark-router` extends `koa-router` with a method `load(directory, prefix)`. By calling `router.load(directory, prefix)`, `lark-router` will load all js files recursively under that directory, and use their exports as callbacks to the routes corresponding to their paths.

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
 
export const GET = async (ctx, next) => {
    // handle requests on GET /hello/world
}

export const DELETE = async (ctx, next) => {
    // handle request on DELETE /hello/world
}

```

or use `router` directly by exporting a function

```
/**
 * @file: hello/world.js
 **/

export default router => {
    router.get('/', async (ctx, next) => {
        // handle requests on GET /hello/world
    }
    router.get('/:foo/:bar', async (ctx, next) => {
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
