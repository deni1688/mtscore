import {container, Labels, AxiosInstance} from "../../../index";

export function Webhook(req: any, res: any, next: any) {
    const axios = container.get<AxiosInstance>(Labels.axios);

    axios.post("http://localhost:3000/todos/webhook", {
        message: "Someone requested todos"
    }, {headers: {authorization: process.env.API_KEY}}).catch(console.log);

    next();
}
