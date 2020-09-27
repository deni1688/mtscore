"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = exports.register = exports.controller = void 0;
const inversify_1 = require("inversify");
const ioc_config_1 = require("./ioc.config");
const nf_core_1 = require("./nf-core");
function controller(prefix, ...middleware) {
    return (t) => {
        inversify_1.decorate(inversify_1.injectable(), t);
        ioc_config_1.container.bind(Symbol.for(t.name)).to(t);
        if (prefix) {
            nf_core_1.NFCore.registerPrefix(t.name, prefix);
        }
        nf_core_1.NFCore.registerControllerMiddleware(t.name, ...middleware);
    };
}
exports.controller = controller;
function register(id) {
    return (t) => {
        inversify_1.decorate(inversify_1.injectable(), t);
        ioc_config_1.container.bind(id).to(t);
    };
}
exports.register = register;
function route(httpMethod, path, ...middleware) {
    return (controllerClass, controllerMethod) => nf_core_1.NFCore.registerRoute({
        path: path ? path[0] === "/" ? path : `/${path}` : "/",
        method: httpMethod,
        controllerClass: Symbol.for(controllerClass.constructor.name),
        controllerMethod: controllerMethod,
        middleware: [...middleware]
    });
}
exports.route = route;
