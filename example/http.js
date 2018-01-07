'use strict';

const http = require('http');
const Router = require('..');

const router = new Router({
    methods: ['MY-MEHTOD']
});


router.get('/hello/:name', (request, response) => {
    response.write(`Hello, ${request.params.name}!`);
    response.end();
});


const routes = router.routes();
module.exports = http.createServer((req, res) => {
    routes(req, res).catch(error => console.log(error.stack));
}).listen(3000);
