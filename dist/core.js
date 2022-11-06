"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mtsCore = exports.MTSCoreImpl = void 0;
const ioc_1 = require("./ioc");
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
                const routePath = route.path;
                const routeMethod = route.method.toLocaleUpperCase();
                const routeController = controllerClassName;
                const routeHandler = route.controllerMethod;
                const routeControllerMiddleware = controllerMiddleware.map(f => f.name);
                const routeHandlerMiddleware = route.middleware.map(f => f.name);
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
