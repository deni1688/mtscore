import * as express from 'express';
import * as morgan from 'morgan';
import {container, MTSCore} from "../";
import {config} from "./config";

/*
 * Import your api and declare additional dependencies
 * before you call the MTSCore.init method
 */
import "./api";

container.bind("config").toConstantValue(config);

const app: express.Application = express();

MTSCore.init(
    app,
    express.json(),
    express.urlencoded({extended: true}),
    morgan("combined")
);

app.listen(config.port, () => console.log("server started at http://localhost:3000"));
