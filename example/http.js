'use strict';

const http = require('http');

const Router = require('..');

const router = new Router();

router.get('/hello/:name', (request, response) => {
    response.write(`Hello, ${request.params.name}!`);
    response.end();
});

module.exports = http.createServer(router.routes()).listen(3000);
