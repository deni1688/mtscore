"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const axios_1 = require("axios");
const constants_1 = require("./constants");
exports.container = new inversify_1.Container();
exports.container.bind(constants_1.TYPES.axios).toConstantValue(axios_1.default);
