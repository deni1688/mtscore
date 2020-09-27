import {inject, register, Labels, AxiosInstance} from "../../../";

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

export const TodoServiceLabel = Symbol.for("TodoService")

@register(TodoServiceLabel)
export class TodoServiceImpl implements TodoService {
    constructor(@inject(Labels.axios) private axios: AxiosInstance) {
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
