import {Application, Handler} from 'express';
import {HttpMethod} from './mts-core';

export * from './constants';
export * from './decorators';
export {mtsCore} from './mts-core';
export {container} from './ioc-config';
export {inject, injectable, decorate} from 'inversify';
export {AxiosInstance} from 'axios';


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

