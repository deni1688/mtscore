import 'reflect-metadata';
import { Container } from 'inversify';

import axios, { AxiosInstance } from 'axios';
import { TYPES } from './constants';

export const container = new Container();

container.bind<AxiosInstance>(TYPES.axios).toConstantValue(axios);



