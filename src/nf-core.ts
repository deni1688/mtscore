import {Application} from "express";
import {container} from "./ioc.config";
import * as chalk from "chalk";

export type HTTPMethod = "get" | "put" | "post" | "delete";

export interface Route {
    path: string;
    method: HTTPMethod;
    controllerClass: symbol
    controllerMethod: string;
    middleware: Function[];
}

export const NfCore = class {
    private static routes: Map<string, Route> = new Map<string, Route>();
    private static prefixes: Map<string, string> = new Map<string, string>();

    static registerRoute(route: Route) {
        NfCore.routes.set(route.path, route);
    }

    static registerPrefix(controllerName: string, prefix: string) {
        NfCore.prefixes.set(controllerName, prefix);
    }

    static init(app: Application, middleware: Function[] = []) {
        NfCore.initMiddleware(app, middleware);
        NfCore.initRoutes(app);
    }

    private static initMiddleware(app, middleware: Function[]) {
        middleware.forEach((middleware: Function) => app.use(middleware))
    }

    private static initRoutes(app) {
        NfCore.routes.forEach((route: Route) => {
            const controller = container.get(route.controllerClass);
            const prefix = NfCore.prefixes.get(controller.constructor.name);

            route.path = prefix ? `/${prefix}${route.path}` : route.path;
            app[route.method](route.path, ...route.middleware, controller[route.controllerMethod].bind(controller));

            if (process.env.NF_LOG_REGISTERED) {
                const routeName = chalk.green(route.method.toLocaleUpperCase());
                const routePath = chalk.yellow(route.path);
                const routeController = chalk.blue(controller.constructor.name);
                const routeHandler = chalk.red(route.controllerMethod);

                console.log(`${routeName} -> ${routePath} -> ${routeController}.${routeHandler}`);
            }
        });
    }
}
