var rd = require('rd');
var path = require('path');
var strip = require('strip-path');
var Router = require('koa-router');
var mount = require('koa-mount');
var compose = require('koa-compose');
var fs = require('fs');
var dirname = require('app-root-path').toString();


/**
 * add bootstrap
 * @param options {optional}
 * @returns {Function|*|exports}
 */
var bootstrap = function (options) {
  var files = [];
  var routers = [];
  options = options || {};
  var directory = options.directory || 'controllers';
  directory = path.join(dirname, directory);
  if (!fs.existsSync(directory)) {
    var err = 'directory ' + directory + " doesn't exist";
    throw new Error(err);
  }
  rd.eachFileFilterSync(directory, /\.js$/, function (file) {
    var dir = path.dirname(file);
    var base = path.basename(file);
    files.push({dirname: dir, basename: base});
  });
  files.forEach(function (file) {
    if (file && file.basename != 'index.js') {
      file.basename = file.basename.substring(0, file.basename.length - 3)
      file.dirname = path.join(file.dirname, file.basename);
    }
    var route = '/' + strip(file.dirname, directory);
    var router = require(file.dirname)(new Router());
    routers.push(mount(route, router.middleware()));
  });
  return compose(routers);
};

module.exports = bootstrap;

