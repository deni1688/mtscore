import {AxiosInstance} from "axios";
import {inject, register} from "../../../";

export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoService {
    findAll(): Promise<Todo[]>;

    findById(id: string): Promise<Todo>;
}

export const TodoServiceSymbol = Symbol.for("TodoService");

@register(TodoServiceSymbol)
export class TodoServiceImpl implements TodoService {
    constructor(@inject("Axios") private axios: AxiosInstance,) {
    }

    async findAll(): Promise<Todo[]> {
        const {data} = await this.axios("https://jsonplaceholder.typicode.com/todos");
        return data;
    }

    async findById(id: string): Promise<Todo> {
        const {data} = await this.axios("https://jsonplaceholder.typicode.com/todos/" + id);
        return data;
    }
}
