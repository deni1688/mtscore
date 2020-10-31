"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = exports.Http = void 0;
var Http;
(function (Http) {
    Http["GET"] = "get";
    Http["POST"] = "post";
    Http["PUT"] = "put";
    Http["DELETE"] = "delete";
    Http["PATCH"] = "patch";
})(Http = exports.Http || (exports.Http = {}));
exports.TYPES = {
    axios: Symbol.for('axios')
};
