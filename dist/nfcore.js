"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFCore = void 0;
const ioc_config_1 = require("./ioc.config");
exports.NFCore = (_a = class {
        static registerRoute(route) {
            exports.NFCore.routes.set(route.path, route);
        }
        static registerPrefix(controllerName, prefix) {
            exports.NFCore.prefixes.set(controllerName, prefix);
        }
        static init(app, middleware = []) {
            exports.NFCore.initMiddleware(app, middleware);
            exports.NFCore.initRoutes(app);
        }
        static initMiddleware(app, middleware) {
            middleware.forEach((middleware) => app.use(middleware));
        }
        static initRoutes(app) {
            exports.NFCore.routes.forEach((route) => {
                const controller = ioc_config_1.container.get(route.controllerClass);
                const prefix = exports.NFCore.prefixes.get(controller.constructor.name);
                route.path = prefix ? `/${prefix}${route.path}` : route.path;
                app[route.method](route.path, ...route.middleware, controller[route.controllerMethod].bind(controller));
                console.log(`${route.method.toLocaleUpperCase()} -> ${route.path} -> ${controller.constructor.name}.${route.controllerMethod}`);
            });
        }
    },
    _a.routes = new Map(),
    _a.prefixes = new Map(),
    _a);
