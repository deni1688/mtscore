"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.bindRoutesToControllers(app);
        this.initAppMiddleware(app, ...middleware);
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
        return (...args) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fn(...args);
            }
            catch (e) {
                args[2](e);
            }
        });
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
            app[route.method](route.path, ...controllerMiddleware, ...route.middleware, this.asyncErrorHandler(controller[route.controllerMethod].bind(controller)));
            if (process.env.MTS_LOG_REGISTERED) {
                const routePath = chalk.yellow(route.path);
                const routeMethod = chalk.magenta(route.method.toLocaleUpperCase());
                const routeController = chalk.blue(controllerClassName);
                const routeHandler = chalk.red(route.controllerMethod);
                console.log(`${routeMethod} -> ${routePath} -> ${routeController}.${routeHandler}`);
            }
        });
    }
}
exports.MTSCore = new _MTSCore();
