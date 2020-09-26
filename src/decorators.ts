import {injectable, decorate} from "inversify";
import {container} from "./ioc.config";
import {HTTPMethod, Route, NfCore} from "./nf-core";

export function controller(prefix?: string) {
    return (t: any) => {
        decorate(injectable(), t);
        container.bind(Symbol.for(t.name)).to(t);

        if (prefix) {
            NfCore.registerPrefix(t.name, prefix)
        }
    }
}

export function register(id: symbol) {
    return (t: any) => {
        decorate(injectable(), t);
        container.bind(id).to(t);
    }
}

export function route(httpMethod: HTTPMethod, path?: string, ...middleware: Function[]) {
    return (controllerClass: any, controllerMethod: string) => NfCore.registerRoute({
        path: path ? path[0] === "/" ? path : `/${path}` : "/",
        method: httpMethod,
        controllerClass: Symbol.for(controllerClass.constructor.name),
        controllerMethod: controllerMethod,
        middleware: [...middleware]
    })
}
