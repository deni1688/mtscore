import {Application, Handler} from 'express';
import {HttpMethod} from './mts-core';

export interface Route {
    path: string;
    method: HttpMethod;
    controllerClass: symbol
    controllerMethod: string;
    middleware: Handler[];
}

export interface MTSCore {
    routes: Map<string, Route>;
    prefixes: Map<string, string>;
    controllerMiddleware: Map<string, Handler[]>;

    init(app: Application): void;
    registerRoute(route: Route): void;
    registerPrefix(controllerName: string, prefix: string): void;
    registerControllerMiddleware(controllerName: string, ...middleware: Handler[]): void;
    asyncErrorHandler(fn): (...args) => Promise<void>;
}

export const mtsCore: MTSCore;

