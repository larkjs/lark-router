/**
 * Load the right module depending on current node version
 **/
'use strict';

var debug = require('debug')('lark-router');

debug("Loader: check node version");

var node_version = process.version;

if ('string' !== typeof node_version) {
    console.warn('Invalid node_version type : ' + typeof node_version);
    process.exit(1);
}

var matches = node_version.match(/^.*?(\d+)\.(\d+)\.(\d+).*$/);

if (!matches) {
    console.warn('Invalid node_version ' + node_version);
    process.exit(1);
}

node_version = parseInt(matches[1]) * 10000 + parseInt(matches[2]) * 100 + parseInt(matches[3]);

var node_version_v5 = 50000;

if (node_version < node_version_v5) {
    debug("Loader: use es5 for node lower than v5");
    module.exports = require('./release/es5').default;
}
else {
    debug("Loader: use es6 for node higher than v5");
    module.exports = require('./release/nodev5').default;
}
