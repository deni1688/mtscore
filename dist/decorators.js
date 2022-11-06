"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = exports.register = exports.controller = void 0;
const inversify_1 = require("inversify");
const ioc_1 = require("./ioc");
const core_1 = require("./core");
function controller(prefix, ...middleware) {
    return (t) => {
        (0, inversify_1.decorate)((0, inversify_1.injectable)(), t);
        ioc_1.container.bind(Symbol.for(t.name)).to(t);
        if (prefix) {
            core_1.mtsCore.registerPrefix(t.name, prefix);
        }
        core_1.mtsCore.registerControllerMiddleware(t.name, ...middleware);
    };
}
exports.controller = controller;
function register(key) {
    return (t) => {
        (0, inversify_1.decorate)((0, inversify_1.injectable)(), t);
        ioc_1.container.bind(key).to(t);
    };
}
exports.register = register;
function route(httpMethod, path, ...middleware) {
    return (controllerClass, controllerMethod) => core_1.mtsCore.registerRoute({
        path: path ? path[0] === '/' ? path : `/${path}` : '/',
        method: httpMethod,
        controllerClass: Symbol.for(controllerClass.constructor.name),
        controllerMethod: controllerMethod,
        middleware: [...middleware]
    });
}
exports.route = route;
