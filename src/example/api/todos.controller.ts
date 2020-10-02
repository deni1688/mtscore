import {controller, route, inject, Http} from "../../index";
import {TodoService, TodoServiceLabel} from "../services";
import {Auth, Webhook} from "./middleware";

export interface TodoController {
    getAll(req: any, res: any): Promise<void>;

    getById(req: any, res: any): Promise<void>;
}

@controller("todos", Auth(process.env.API_KEY))
export class TodoControllerImpl implements TodoController {
    constructor(@inject(TodoServiceLabel) private todoService: TodoService) {
    }

    @route(Http.GET, "/", Webhook)
    async getAll(request, response): Promise<void> {
        const todos = await this.todoService.findAll();

        response.status(200).send(todos)
    }

    @route(Http.GET, ":id")
    async getById(request, response): Promise<void> {
        const todo = await this.todoService.findById(request.params.id);

        response.status(200).send(todo)
    }

    @route(Http.POST, "webhook")
    webhook(request, response): void {
        console.log(request.body);
        response.status(200).send({});
    }
}

