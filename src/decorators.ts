import {injectable, decorate} from "inversify";
import {container} from "./ioc.config";
import {HttpMethod, MTSCore} from "./mts-core";

export function controller(prefix?: string, ...middleware: Function[]) {
    return (t: any) => {
        decorate(injectable(), t);
        container.bind(Symbol.for(t.name)).to(t);

        if (prefix) {
            MTSCore.registerPrefix(t.name, prefix)
        }

        MTSCore.registerControllerMiddleware(t.name, ...middleware);
    }
}

export function register(id: symbol) {
    return (t: any) => {
        decorate(injectable(), t);
        container.bind(id).to(t);
    }
}

export function route(httpMethod: HttpMethod, path?: string, ...middleware: Function[]) {
    return (controllerClass: any, controllerMethod: string) => MTSCore.registerRoute({
        path: path ? path[0] === "/" ? path : `/${path}` : "/",
        method: httpMethod,
        controllerClass: Symbol.for(controllerClass.constructor.name),
        controllerMethod: controllerMethod,
        middleware: [...middleware]
    })
}
