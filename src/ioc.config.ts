/*
 * All global dependencies of the framework
 * can be declared here which will make it available
 * for injections everywhere in the app.
 */
import 'reflect-metadata';
import {Container} from 'inversify';

import axios, {AxiosInstance} from 'axios';
import {Labels} from './constants';

export const container = new Container();

container.bind<AxiosInstance>(Labels.axios).toConstantValue(axios);
