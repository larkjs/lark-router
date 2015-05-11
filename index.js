var rd = require('rd');
var path = require('path');
var strip = require('strip-path');
var Router = require('koa-router');
var mount = require('koa-mount');
var compose = require('koa-compose');
var fs = require('fs');


var dirname = require('app-root-path').toString();
var used = false;

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
  if ('function' === typeof controller) {
    if ('GeneratorFunction' === controller.constructor.name) {
      return router.get('/', controller);
    }
    else {
      return controller(router);
    }
  }
  else if ('object' === typeof controller) {
    for (var method in controller) {
      method = method.toLowerCase();
      if ('function' !== typeof router[method]) {
        throw new Error("Invalid method " + method + " defined in controller");
      }
      var paths = controller[method];
      for (var routePath in paths) {
        var handler = paths[routePath];
        if ('function' !== typeof handler || 'GeneratorFunction' === controller.constructor.name) {
          throw new Error('Router handler must be a generator function !');
        }
        router[method](routePath, handler);
      }
    }
  } 
}

module.exports = bootstrap;

