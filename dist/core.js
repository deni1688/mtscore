"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mtsCore = exports.MTSCoreImpl = void 0;
const ioc_1 = require("./ioc");
const chalk_1 = require("chalk");
class MTSCoreImpl {
    constructor() {
        this.routes = new Map();
        this.prefixes = new Map();
        this.controllerMiddleware = new Map();
    }
    init(app) {
        this.routes.forEach((route) => {
            const controller = ioc_1.container.get(route.controllerClass);
            const controllerClassName = controller.constructor.name;
            const prefix = this.prefixes.get(controllerClassName);
            const controllerMiddleware = this.controllerMiddleware.get(controllerClassName);
            route.path = prefix ? `/${prefix}${route.path}` : route.path;
            app[route.method](route.path, ...controllerMiddleware, ...route.middleware, this.asyncErrorHandler(controller[route.controllerMethod].bind(controller)));
            if (process.env.MTS_LOG_REGISTERED) {
                const routePath = chalk_1.default.yellow(route.path);
                const routeMethod = chalk_1.default.magenta(route.method.toLocaleUpperCase());
                const routeController = chalk_1.default.blue(controllerClassName);
                const routeHandler = chalk_1.default.red(route.controllerMethod);
                const routeControllerMiddleware = chalk_1.default.white(controllerMiddleware.map(f => f.name));
                const routeHandlerMiddleware = chalk_1.default.white(route.middleware.map(f => f.name));
                console.log(`${routeMethod} -> ${routePath} -> ${routeController}[${routeControllerMiddleware}]::${routeHandler}[${routeHandlerMiddleware}]`);
            }
        });
    }
    registerRoute(route) {
        const routeKey = route.path + route.controllerMethod;
        this.routes.set(routeKey, route);
    }
    registerPrefix(controllerName, prefix) {
        this.prefixes.set(controllerName, prefix);
    }
    registerControllerMiddleware(controllerName, ...middleware) {
        this.controllerMiddleware.set(controllerName, [...middleware]);
    }
    asyncErrorHandler(fn) {
        return async (...args) => {
            try {
                await fn(...args);
            }
            catch (e) {
                args[2](e);
            }
        };
    }
}
exports.MTSCoreImpl = MTSCoreImpl;
exports.mtsCore = new MTSCoreImpl();
