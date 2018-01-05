/**
 * All methods supported. Besides common methods like GET POST
 * Add 3 special methods: ALL, ROUTED and OTHER
 * ALL:     match all methods
 * ROUTED:  match route requests that has been matched and routed in previous route rules.
 * OTHER:   opposite to ROUTED, match route requests that has not been matched.
 **/
'use strict';

const methods = require('methods');

module.exports = {
    request: methods.map(method => method.toUpperCase()),
    special: ['ALL', 'ROUTED', 'OTHER'],
};
