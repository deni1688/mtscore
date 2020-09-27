import {Application} from "express";
import {container} from "./ioc.config";
import * as chalk from "chalk";

export type HttpMethod = "get" | "put" | "post" | "delete";

export interface Route {
    path: string;
    method: HttpMethod;
    controllerClass: symbol
    controllerMethod: string;
    middleware: Function[];
}

export const NFCore = class {
    private static routes: Map<string, Route> = new Map<string, Route>();
    private static prefixes: Map<string, string> = new Map<string, string>();
    private static controllerMiddleware: Map<string, Function[]> = new Map<string, Function[]>();

    static init(app: Application, ...middleware: Function[]) {
        NFCore.initAppMiddleware(app, ...middleware);
        NFCore.bindRoutesToController(app);
    }

    static registerRoute(route: Route) {
        NFCore.routes.set(route.path, route);
    }

    static registerPrefix(controllerName: string, prefix: string) {
        NFCore.prefixes.set(controllerName, prefix);
    }

    static registerControllerMiddleware(controllerName: string, ...middleware: Function[]) {
        NFCore.controllerMiddleware.set(controllerName, [...middleware]);
    }

    private static initAppMiddleware(app, ...middleware: Function[]) {
        middleware.forEach((m: Function) => app.use(m));
    }

    private static bindRoutesToController(app) {
        NFCore.routes.forEach((route: Route) => {
            const controller = container.get(route.controllerClass);
            const controllerClassName = controller.constructor.name;
            const prefix = NFCore.prefixes.get(controllerClassName);
            const controllerMiddleware = NFCore.controllerMiddleware.get(controllerClassName);

            route.path = prefix ? `/${prefix}${route.path}` : route.path;
            app[route.method](
                route.path,
                ...controllerMiddleware,
                ...route.middleware,
                controller[route.controllerMethod].bind(controller)
            );

            if (process.env.NF_LOG_REGISTERED) {
                const routeName = chalk.green(route.method.toLocaleUpperCase());
                const routePath = chalk.yellow(route.path);
                const routeController = chalk.blue(controllerClassName);
                const routeHandler = chalk.red(route.controllerMethod);

                console.log(`${routeName} -> ${routePath} -> ${routeController}.${routeHandler}`);
            }
        });
    }
}
