import { Application, Handler } from 'express';
import { HttpMethod } from './core';

// Third party
export * from 'inversify';
export * from 'axios';
export * from 'express';

// MtsCore
export * from './constants';
export * from './decorators';
export { mtsCore } from './core';
export { container } from './ioc';




export interface Route {
    path: string;
    method: HttpMethod;
    controllerClass: symbol
    controllerMethod: string;
    middleware: Handler[];
}

export interface MTSCore {
    init(app: Application): void;
    registerRoute(route: Route): void;
    registerPrefix(controllerName: string, prefix: string): void;
    registerControllerMiddleware(controllerName: string, ...middleware: Handler[]): void;
}

