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

class _MTSCore {
    private routes: Map<string, Route> = new Map<string, Route>();
    private prefixes: Map<string, string> = new Map<string, string>();
    private controllerMiddleware: Map<string, Function[]> = new Map<string, Function[]>();

    init(app: Application, ...middleware: Function[]) {
        this.initAppMiddleware(app, ...middleware);
        this.bindRoutesToControllers(app);
    }

    registerRoute(route: Route) {
        this.routes.set(route.path, route);
    }

    registerPrefix(controllerName: string, prefix: string) {
        this.prefixes.set(controllerName, prefix);
    }

    registerControllerMiddleware(controllerName: string, ...middleware: Function[]) {
        this.controllerMiddleware.set(controllerName, [...middleware]);
    }

    private initAppMiddleware(app, ...middleware: Function[]) {
        middleware.forEach((m: Function) => app.use(m));
    }

    private bindRoutesToControllers(app) {
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

export const MTSCore = new _MTSCore();
