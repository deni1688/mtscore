"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
/*
 * All global dependencies of the framework
 * can be declared here which will make it available
 * for injections everywhere in the app.
 */
require("reflect-metadata");
const inversify_1 = require("inversify");
const axios_1 = require("axios");
const constants_1 = require("./constants");
exports.container = new inversify_1.Container();
exports.container.bind(constants_1.Labels.axios).toConstantValue(axios_1.default);
//# sourceMappingURL=ioc.config.js.map