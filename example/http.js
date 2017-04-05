'use strict';

const http = require('http');

const Router = require('..');

const router = new Router();

router.get('/hello/:name', (req, res) => {
    res.write(`Hello, ${req.params.name}!`);
    res.end();
});

module.exports = http.createServer(router.routes()).listen(3000);
