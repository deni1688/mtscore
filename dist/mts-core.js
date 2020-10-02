"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MTSCore = void 0;
const ioc_config_1 = require("./ioc.config");
const chalk = require("chalk");
class _MTSCore {
    constructor() {
        this.routes = new Map();
        this.prefixes = new Map();
        this.controllerMiddleware = new Map();
    }
    init(app, ...middleware) {
        this.initAppMiddleware(app, ...middleware);
        this.bindRoutesToControllers(app);
    }
    registerRoute(route) {
        this.routes.set(route.path, route);
    }
    registerPrefix(controllerName, prefix) {
        this.prefixes.set(controllerName, prefix);
    }
    registerControllerMiddleware(controllerName, ...middleware) {
        this.controllerMiddleware.set(controllerName, [...middleware]);
    }
    initAppMiddleware(app, ...middleware) {
        middleware.forEach((m) => app.use(m));
    }
    bindRoutesToControllers(app) {
        this.routes.forEach((route) => {
            const controller = ioc_config_1.container.get(route.controllerClass);
            const controllerClassName = controller.constructor.name;
            const prefix = this.prefixes.get(controllerClassName);
            const controllerMiddleware = this.controllerMiddleware.get(controllerClassName);
            route.path = prefix ? `/${prefix}${route.path}` : route.path;
            app[route.method](route.path, ...controllerMiddleware, ...route.middleware, controller[route.controllerMethod].bind(controller));
            if (process.env.NF_LOG_REGISTERED) {
                const routeName = chalk.green(route.method.toLocaleUpperCase());
                const routePath = chalk.yellow(route.path);
                const routeController = chalk.blue(controllerClassName);
                const routeHandler = chalk.red(route.controllerMethod);
                console.log(`${routeName} -> ${routePath} -> ${routeController}.${routeHandler}`);
            }
        });
    }
}
exports.MTSCore = new _MTSCore();
