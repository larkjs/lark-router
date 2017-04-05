'use strict';

const methods = require('methods');

module.exports = {
    request: methods.map(method => method.toUpperCase()),
    special: ['ALL', 'ROUTED', 'OTHER'],
};
