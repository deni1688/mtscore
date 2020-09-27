import * as express from 'express';
import * as morgan from 'morgan';
import {container, NFCore} from "../";
import {config} from "./config";

/*
 * Import your pods and declare additional dependencies
 * before you call the NFCore.init method
 */
import "./pods";

container.bind("config").toConstantValue(config);

const app: express.Application = express();

NFCore.init(
    app,
    express.json(),
    express.urlencoded({extended: true}),
    morgan("combined")
);

app.listen(3000, () => console.log("server started at http://localhost:3000"));
