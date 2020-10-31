import {Handler} from 'express';
import {container} from './ioc-config';
import * as chalk from 'chalk';
import {MTSCore, Route} from './interfaces';

export type HttpMethod = 'get' | 'put' | 'post' | 'delete';

export class MTSCoreImpl implements MTSCore {
    routes: Map<string, Route> = new Map<string, Route>();
    prefixes: Map<string, string> = new Map<string, string>();
    controllerMiddleware: Map<string, Handler[]> = new Map<string, Handler[]>();

    init(app) {
        this.routes.forEach((route: Route) => {
            const controller = container.get(route.controllerClass);
            const controllerClassName = controller.constructor.name;
            const prefix = this.prefixes.get(controllerClassName);
            const controllerMiddleware = this.controllerMiddleware.get(controllerClassName);

            route.path = prefix ? `/${prefix}${route.path}` : route.path;
            app[route.method](
                route.path,
                ...controllerMiddleware,
                ...route.middleware,
                this.asyncErrorHandler(controller[route.controllerMethod].bind(controller))
            );

            if (process.env.MTS_LOG_REGISTERED) {
                const routePath = chalk.yellow(route.path);
                const routeMethod = chalk.magenta(route.method.toLocaleUpperCase());
                const routeController = chalk.blue(controllerClassName);
                const routeHandler = chalk.red(route.controllerMethod);

                console.log(`${routeMethod} \t-> ${routePath} \t-> ${routeController}::${routeHandler}`);
            }
        });
    }

    registerRoute(route: Route) {
        const routeKey = route.path + route.controllerMethod;
        this.routes.set(routeKey, route);
    }

    registerPrefix(controllerName: string, prefix: string) {
        this.prefixes.set(controllerName, prefix);
    }

    registerControllerMiddleware(controllerName: string, ...middleware: Handler[]) {
        this.controllerMiddleware.set(controllerName, [...middleware]);
    }

    asyncErrorHandler(fn) {
        return async (...args) => {
            try {
                await fn(...args);
            } catch (e) {
                args[2](e);
            }
        };
    }
}

export const mtsCore: MTSCore = new MTSCoreImpl();
