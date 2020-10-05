import {Application, Handler} from "express";
import {container} from "./ioc.config";
import * as chalk from "chalk";

export type HttpMethod = "get" | "put" | "post" | "delete";

export interface Route {
    path: string;
    method: HttpMethod;
    controllerClass: symbol
    controllerMethod: string;
    middleware: Handler[];
}

class MTSCore {
    private app: Application;
    private routes: Map<string, Route> = new Map<string, Route>();
    private prefixes: Map<string, string> = new Map<string, string>();
    private controllerMiddleware: Map<string, Function[]> = new Map<string, Handler[]>();

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

                console.log(`${routeMethod} -> ${routePath} -> ${routeController}.${routeHandler}`);
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

    private asyncErrorHandler(fn) {
        return async (...args) => {
            try {
                await fn(...args);
            } catch (e) {
                args[2](e);
            }
        };
    }
}

export const mtsCore = new MTSCore();
