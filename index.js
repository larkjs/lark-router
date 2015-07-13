var rd = require('rd');
var path = require('path');
var strip = require('strip-path');
var Router = require('koa-router');
var mount = require('koa-mount');
var compose = require('koa-compose');
var fs = require('fs');


var used = false;

var dirname = path.dirname(process.mainModule.filename);

/**
 * add bootstrap
 * @param options {optional}
 * @returns {Function|*|exports}
 */
var bootstrap = function (options) {
  if (used) return function*(next) {
    yield next
  };
  used = true;
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
    if (file.basename[0] === '.') {
      return;
    }
    var route = '/' + strip(file.dirname, directory);
    var router = new Router();
    //require(file.dirname)(router);
    addRouter(file.dirname, router);
    routers.push(mount(route, router.middleware()));
  });
  this.larkBootstrap = true;
  return compose(routers);
};

function addRouter(dirname, router) {
  var controller = require(dirname);
  if (!controller) {
    throw new Error('Controller is empty in ' + dirname + ',' + router);
  }
  if ('object' !== typeof controller) {
    return addRoutePath(router, controller);
  }
  if (Array.isArray(controller)) {
    throw new Error('Controller can NOT be an array');
  }
  for (var method in controller) {
    method = method.toLowerCase();
    if (-1 === router.methods.indexOf(method.toUpperCase())) {
      throw new Error('Invalid method : ' + method);
    }
    var paths = controller[method];
    for (var routePath in paths) {
      var handler = paths[routePath];
      addRoutePath(router, method, routePath, handler);
    }
  }
  return;
}

function addRoutePath (router, _method, _routePath, _handler) {
  var handler = _handler || _routePath || _method;
  var routePath = !!_handler ? _routePath : '/';
  var method  = !!_routePath ? _method.toLowerCase() : 'get';

  if ('function' === typeof handler && 'GeneratorFunction' === handler.constructor.name) {
    if (-1 === router.methods.indexOf(method.toUpperCase())) {
      throw new Error('Invalid method : ' + method);
    }
    return router[method](routePath, handler);
  }
  if ('function' === typeof handler) {
    return handler(router);
  }
  throw new Error((typeof handler) + ' can not be set as a router');
}

module.exports = bootstrap;

