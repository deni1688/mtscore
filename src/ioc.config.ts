import "reflect-metadata"
import {Container} from "inversify";

import axios, {AxiosInstance} from "axios";

export const container = new Container();

container.bind<AxiosInstance>("Axios").toConstantValue(axios);
