/**
 * Lark router, auto generate routes by directory structure
 **/
'use strict';

import _debug     from 'debug';
import caller     from 'caller';
import chalk      from 'chalk';
import extend     from 'extend';
import path       from 'path';
import fs         from 'fs';
import KoaRouter  from 'koa-router';
import escapeRegexp   from 'escape-string-regexp';

const debug = _debug('lark-router');

/**
 * Extends KoaRouter with the following methods:
 * @method create(options) returns a new instance of Router
 * @method load(directory, prefix) generate routes by the directory structure
 **/
class Router extends KoaRouter {
    constructor (options = {}) {
        if (options && !(options instanceof Object)) {
            throw new Error('Options must be an object if given');
        }
        debug('Router: Router.constructor');
        super(options);

        this.opts.param_prefix = this.opts.param_prefix || '_';
        if ('string' !== typeof this.opts.param_prefix || !this.opts.param_prefix.match(/^\S+$/)) {
            throw new Error("Router options param_prefix must be a string matching patter \\S+");
        }
        this.opts.prefix_esc = escapeRegexp(this.opts.param_prefix);

        this.opts.default = this.opts.default || 'index.js';
        if ('string' !== typeof this.opts.default || this.opts.default.length === 0) {
            throw new Error("Router options default must be a string");
        }
    }
    static create (options) {
        debug('Router: Router.create');
        return new Router(options);
    }
    load (root, prefix) {
        debug('Router: loading by root path ' + root);
        if ('string' !== typeof root) {
            throw new Error('Router loading root path is not a string');
        }

        root = path.normalize(root);

        if (!path.isAbsolute(root)) {
            debug('Router: root is not absolute, make an absolute one');
            root = path.join(path.dirname(caller()), root);
        }

        if (prefix) {
            prefix = String(path.normalize(prefix)).replace(/\\/g,"/");
            if (!prefix || !prefix[0] || prefix[0] === '.') {
                throw new Error('Invalid router prefix ' + prefix);
            }
            debug('Router: create a new Router to load with prefix ' + prefix);
            const opts = extend(true, {}, this.opts);
            opts.routePrefix = opts.routePrefix || '';
            opts.routePrefix += prefix;
            const router = Router.create(opts).load(root);
            debug('Router: using the router with prefix ' + prefix);
            this.use(prefix, router.routes());
            return this;
        }

        debug('Router; loading by directory structure of ' + root); 

        /**
         * First load all files, then load directories recrusively
         **/
        const dirlist   = [];
        const filelist  = [];
        const list      = fs.readdirSync(root);
        for (const filename of list) {
            let routePath = name2routePath(filename, this.options);
            if (routePath === false) {
                continue;
            }
            routePath = '/' + routePath;
            const item = { filename, routePath };
            const absolutePath = path.join(root, filename);
            const stat = fs.statSync(absolutePath);
            if (stat.isDirectory()) {
                dirlist.push(item);
            }
            else if (stat.isFile()) {
                filelist.push(item);
            }
        }
        for (const item of filelist) {
            loadRouteByFilename(this, item.filename, item.routePath, root);
        }
        for (const item of dirlist) {
            this.load(path.join(root, item.filename), item.routePath);
        }
        return this;
    }
}

function name2routePath (name, options) {
    debug('Router: convert name to route path : ' + name);
    if ('string' !== typeof name) {
        throw new Error('Name must be a string');
    }
    if (name === (options.default || 'index.js')) {
        return '';
    }
    const extname = path.extname(name);
    if (extname && extname !== '.js') {
        return false;
    }
    name = path.basename(name, extname);
    if (!name || name[0] === '.') {
        return false;
    }

    const prefix = options.param_prefix || '_';
    const prefix_esc = escapeRegexp(prefix);

    let routePath = name.replace(new RegExp("^" + prefix_esc + "(?!(" + prefix_esc + ")|$)"), ":")
                        .replace(new RegExp("^" + prefix_esc + prefix_esc), prefix);

    debug('Router: convert result is ' + routePath);
    return routePath;
}

function loadRouteByFilename (router, filename, routePath, root) {
    if ('string' !== typeof filename || 'string' !== typeof root) {
        throw new Error('Invalid param to load by dirname');
    }
    debug('Router: loading file ' + filename);
    if (path.extname(filename) !== '.js' || filename.length <= 3) {
        return;
    }

    debug("Router: route path [" + routePath + "]");
    const absolutePath = path.join(root, filename);
    //import fileModule from absolutePath;
    let fileModule = require(absolutePath).default || require(absolutePath);

    if (fileModule instanceof Function) {
        debug("Router: module is a function, use it to handle router directly");
        let subRouter = Router.create(router.opts);
        let result = fileModule(subRouter);
        if (result instanceof Router) {
            subRouter = result;
        }
        router.use(routePath, subRouter.routes());
    }
    else if (fileModule instanceof Object) {
        loadByModule(router, routePath, fileModule);
    }
    else {
        throw new Error('Invalid router module');
    }
}

function loadByModule (router, routePath, module) {
    debug("Router: load route by module");

    //handle redirect routes
    for (const method_ori in module) {
        const METHOD = method_ori.toUpperCase();
        if (METHOD !== 'REDIRECT' || 'string' !== typeof module[method_ori]) {
            continue;
        }

        const desc = METHOD + ' ' + (router.opts.routePrefix || '') + routePath;
        debug("Router: add router " + chalk.yellow(desc + " => " + module[method_ori]));
        router.redirect(routePath, module[method_ori]);
        return;
    }

    //handle methods
    for (const method_ori in module) {
        const method = method_ori.toLowerCase();
        const METHOD = method_ori.toUpperCase();

        const desc = METHOD + ' ' + (router.opts.routePrefix || '') + routePath;

        if (!(module[method_ori] instanceof Function) || router.methods.indexOf(METHOD) < 0) {
            continue;
        }
        debug("Router: add router " + chalk.yellow(desc));

        router[method](routePath, module[method_ori]);
    }
}

export default Router;

debug('Router: load ok');
