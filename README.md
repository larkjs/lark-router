lark-router
=============

Router for lark based on koa 2.0

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![NPM downloads][downloads-image]][npm-url]
[![Node.js dependencies][david-image]][david-url]
  
## Install

```
$ npm install --save lark-router
```

## Get started

_Lark-Router_ is a flexible and easy-to-use url router tool, compatible with native http apps, express apps and koa(v2) apps.

* http apps
```
const router = new LarkRouter();

router.get('/foo/bar', (req, res) => res.end("/foo/bra requested!"));
router.on('error', (error, req, res) => {
    res.statusCode = 500;
    res.end(error.message);
});

http.createServer(router.routes()).listen(3000);
```

* koa apps
```
const router = new LarkRouter();
const app    = new Koa();

router.get('/foo/bar', (ctx, next) => ctx.body = '/foo/bar requested!');
router.on('error', (error, ctx, next) => {
    ctx.statusCode = 500;
    ctx.body = error.message;
    return next();
});

app.use(router.routes()).listen(3000);
```

## Params

See [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp). Params object is bind to the first argument of the app processor.

```javascript
router.get('/:foo/:bar', (ctx, next) => { console.log(ctx.params); }); // ===> { foo: xxx, bar: xxx }
router.get(/^\/(\d+)\/(\w+)$/, (ctx, next) => { console.log(ctx.params); }); // ===> { 0: xxx, 1: xxx}
```
## all, other, routed

Lark router has 3 special methods.
* all: match all requests

```
router.all('/foo/bar', handler);  // ===> response to GET/POST/DELETE/...  /foo/bar
```

* other: match all unmatched requests

```
router.other('*', response404notfound); // ===> response to GET/POST/DELETE/...  /foo/bar if no other route matched
```

* routed: match all matched requests

```
router.routed('/foo/bar', () => console.log('/foo/bar has been routed')); // ===> response to GET/POST/DELETE/...  /foo/bar if some routes matched
```

## Nesting

You could nest routers together:

```
mainRouter.all('/api', apiRouter);
```

_Note that Lark-Router uses a path param to pass the unmatched part of path. That param name can be configured, usually is `subroutine`, and a string `'/:subroutine*'` will be append to that expression automatically._

```
mainRouter.configure({
    'subroutine': 'sub',
    'nesting-path-auto-complete': false,
});

mainRouter.all('/api/:sub*', api); // equivalent to the example above.
```
## Async processors

For async processors, return promises.

```
router.get('/', () => new Promise(...));
```

## Loading files and directories to generate route rules
TBD...

## DETAILED DOC
TBD...
  
[npm-image]: https://img.shields.io/npm/v/lark-router.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-router
[travis-image]: https://img.shields.io/travis/larkjs/lark-router/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-router
[downloads-image]: https://img.shields.io/npm/dm/lark-router.svg?style=flat-square
[david-image]: https://img.shields.io/david/larkjs/lark-router.svg?style=flat-square
[david-url]: https://david-dm.org/larkjs/lark-router
[coveralls-image]: https://img.shields.io/codecov/c/github/larkjs/lark-router.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/larkjs/lark-router
