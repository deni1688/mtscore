import {controller, route, inject, Http} from "../../../";
import {TodoService, TodoServiceSymbol} from "./todos.service";
import {authGuard} from "./auth.guard";

export interface TodoController {
    getAll(req: any, res: any): Promise<void>;

    getById(req: any, res: any): Promise<void>;
}

@controller("todos")
export class TodoControllerImpl implements TodoController {
    constructor(@inject(TodoServiceSymbol) private service: TodoService) {
    }

    @route(Http.GET, "/", authGuard(process.env.API_KEY))
    async getAll(request, response): Promise<void> {
        const todos = await this.service.findAll();

        response.status(200).send(todos)
    }

    @route(Http.GET, ":id", authGuard(process.env.API_KEY))
    async getById(request, response): Promise<void> {
        const todo = await this.service.findById(request.params.id);

        response.status(200).send(todo)
    }
}

