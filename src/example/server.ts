import * as express from 'express';
import * as morgan from 'morgan';

import {NfCore} from "../";

import "./pods";

export const app: express.Application = express();

NfCore.init(app, [morgan('dev')]);

app.listen(3000, () => console.log('server started at http://localhost:3000'));
