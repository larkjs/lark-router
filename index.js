/**
 * Lark router
 **/
'use strict';

import _debug     from 'debug';
import caller     from 'caller';
import path       from 'path';
import fs         from 'fs';
import escapeRegexp   from 'escape-string-regexp';
import KoaRouter  from 'koa-router';

const debug = _debug('lark-router');

class Router extends KoaRouter {
    constructor (root, options = {}) {
        debug('Router: Router.constructor');
        if ('string' !== typeof root) {
            throw new Error("Router root directory should be a string, " + typeof root + " given");
        }
        debug('Router: Router.constructor super');
        super();
        if (!path.isAbsolute(root)) {
            debug('Router: root is not absolute, make an absolute one');
            root = path.join(path.dirname(caller()), root);
        }
        if (!fs.statSync(root).isDirectory()) {
            throw new Error("Router root is not a directory path");
        }
        debug('Router: route is ' + root);
        this.root = root;
        this.options = options;
        this.routeSet = new Set();

        this.options.param_prefix = this.options.param_prefix || '_';
        if ('string' !== typeof this.options.param_prefix || !this.options.param_prefix.match(/^\S+$/)) {
            throw new Error("Router options param_prefix must be a string matching patter \\S+");
        }
        this.options.prefix_esc = escapeRegexp(this.options.param_prefix);

        this.options.default = this.options.default || 'index';
        if ('string' !== typeof this.options.default || this.options.default.length === 0) {
            throw new Error("Router options default must be a string");
        }

        this.load();
    }
    create (root, options) {
        debug('Router: Router.create');
        if (!path.isAbsolute(root)) {
            debug('Router: root is not absolute, make an absolute one');
            root = path.join(path.dirname(caller()), root);
        }
        return new Router(root, options);
    }
    load (dirname) {
        debug('Router: loading by dirname');
        if ('string' !== typeof dirname) {
            dirname = '.';
        }
        let absoluteDirname;
        if (path.isAbsolute(dirname)) {
            debug('Router: dirname is absolute');
            absoluteDirname = dirname;
        }
        else {
            debug('Router: dirname is not absolute, make an absolute one');
            absoluteDirname = path.join(this.root, dirname);
        }
        debug('Router: absolute dirname is ' + absoluteDirname);
        if (absoluteDirname.slice(0, this.root.length) !== this.root) {
            throw new Error("Access denied, router can not load directory " + absoluteDirname);
        }
        dirname = absoluteDirname.slice(this.root.length) || '/';
        debug('Router: loading all files and directories under ' + dirname);
        let dirlist = [];
        let filelist = [];
        let list = fs.readdirSync(absoluteDirname);
        for (let filename of list) {
            const absoluteFileName = path.join(absoluteDirname, filename);
            const stat = fs.statSync(absoluteFileName);
            let relativeFileName = path.join(dirname, filename);
            if (stat.isDirectory()) {
                dirlist.push(relativeFileName);
            }
            else if (stat.isFile()) {
                filelist.push(relativeFileName);
            }
        }
        for (let relativeFileName of filelist) {
            debug('Router: load file in path (' + relativeFileName + ')');
            if (path.extname(relativeFileName) !== '.js') {
                debug('Router: not js file, abort');
                continue;
            }
            const absoluteFileName = path.join(this.root, relativeFileName);
            let routePath = relativeFileName.slice(0, -path.extname(relativeFileName).length);
            const prefix_esc = this.options.prefix_esc;
            const param_prefix = this.options.param_prefix;
            routePath = routePath.replace(new RegExp("\\/" + prefix_esc + "(?!(" + prefix_esc + ")|$)", 'g'), "/:")
                                 .replace(new RegExp("\\/" + prefix_esc + prefix_esc, 'g'), "/" + param_prefix);
            const routePathSplit = routePath.split('/');
            if (routePathSplit[routePathSplit.length - 1] === this.options.default) {
                routePathSplit.pop();
                routePath = routePathSplit.join('/') || '/';
            }
            debug('Router: load file as route path (' + routePath + ')');

            const fileModule = require(absoluteFileName);

            if (fileModule.default) {
                debug('Router: use default as get');
                fileModule.get = fileModule.default;
            }

            let redirect = false;
            for (let method in fileModule) {
                let method_uc = method.toUpperCase();
                if (method_uc !== 'REDIRECT' && 'string' !== typeof fileModule[method]) {
                    continue;
                }
                const routeDescription = method_uc + " " + routePath + " => " + fileModule[method];
                const routeDescriptionRegexp = routeDescription.replace(/\/(:[^\/]+)/g, '/*');
                if (this.routeSet.has(routeDescriptionRegexp)) {
                    throw new Error("Route " + routeDescriptionRegexp + " duplicated");
                }
                debug("Router: add router [" + routeDescription + "]");
                this.redirect(routePath, fileModule[method]);
                redirect = true;
                this.routeSet.add(routeDescriptionRegexp);
            }
            if (redirect) {
                continue;
            }

            for (let method in fileModule) {
                let method_lc = method.toLowerCase();
                let method_uc = method.toUpperCase();
                const routeDescription = method_uc + " " + routePath;
                const routeDescriptionRegexp = routeDescription.replace(/\/(:[^\/]+)/g, '/*');
                if (this.routeSet.has(routeDescriptionRegexp)) {
                    throw new Error("Route " + routeDescriptionRegexp + " duplicated");
                }
                if (!(fileModule[method] instanceof Function) || this.methods.indexOf(method_uc) < 0) {
                    continue;
                }
                debug("Router: add router [" + method_uc + " " + routePath + "]");
                this[method_lc](routePath, fileModule[method]);
                this.routeSet.add(routeDescriptionRegexp);
            }
        }
        for (let relativeDirName of dirlist) {
            debug('Router: load directory in path ' + relativeDirName);
            this.load(path.join(this.root, relativeDirName));
        }
        return this;
    }
};

// Match Koa 2.x
Router.prototype.routes = Router.prototype.middleware = function () {
    const router = this;
    const dispatch = async (ctx, next) => {
        const path = router.opts.routerPath || ctx.routerPath || ctx.path;
        const matched = router.match(path, ctx.method);
        let layer;
        let i;
        let ii;
        if (ctx.matched) {
            ctx.matched.push.apply(ctx.matched, matched.path);
        } else {
            ctx.matched = matched.path;
        }

        if (matched.pathAndMethod.length) {
            i = matched.pathAndMethod.length;
            while (matched.route && i--) {
                layer = matched.pathAndMethod[i];
                ii = layer.stack.length;
                ctx.captures = layer.captures(path, ctx.captures);
                ctx.params = layer.params(path, ctx.captures, ctx.params);

                while (ii--) {
                    await layer.stack[ii](ctx);
                }
            }
        }

        await next();
    };
    dispatch.router = router;
    return dispatch;
};

export default Router;

debug('Router: load ok');
