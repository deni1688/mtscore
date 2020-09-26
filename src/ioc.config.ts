import "reflect-metadata"
import {Container} from "inversify";

import axios, {AxiosInstance} from "axios";
import {Symbols} from "./constants";

export const container = new Container();

container.bind<AxiosInstance>(Symbols.axios).toConstantValue(axios);
