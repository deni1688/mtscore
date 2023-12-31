import { Handler } from 'express';
import { decorate, injectable } from 'inversify';

import { container } from './ioc';
import { HttpMethod, mtsCore } from './core';

export function controller(prefix?: string, ...middleware: Handler[]) {
    return (t: any) => {
        console.log(t)
        decorate(injectable(), t);
        container.bind(Symbol.for(t.name)).to(t);

        if (prefix) {
            mtsCore.registerPrefix(t.name, prefix);
        }

        mtsCore.registerControllerMiddleware(t.name, ...middleware);
    };
}

export function register(key: symbol | string) {
    return (t: any) => {
        decorate(injectable(), t);
        container.bind(key).to(t);
    };
}

export function route(httpMethod: HttpMethod, path?: string, ...middleware: Handler[]) {
    return (controllerClass: any, controllerMethod: string) => mtsCore.registerRoute({
        path: path ? path[0] === '/' ? path : `/${path}` : '/',
        method: httpMethod,
        controllerClass: Symbol.for(controllerClass.constructor.name),
        controllerMethod: controllerMethod,
        middleware: [...middleware]
    });
}
