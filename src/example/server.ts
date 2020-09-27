import * as express from 'express';
import * as morgan from 'morgan';
import {NFCore} from "../";

// This should always com before the NFCore.init
import "./pods";

const app: express.Application = express();

NFCore.init(
    app,
    express.json(),
    express.urlencoded({extended: true}),
    morgan("combined")
);

app.listen(3000, () => console.log("server started at http://localhost:3000"));
