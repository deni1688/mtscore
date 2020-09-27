"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Labels = exports.Http = void 0;
var Http;
(function (Http) {
    Http["GET"] = "get";
    Http["POST"] = "post";
    Http["PUT"] = "put";
    Http["DELETE"] = "delete";
    Http["PATCH"] = "patch";
})(Http = exports.Http || (exports.Http = {}));
exports.Labels = {
    axios: Symbol.for("axios")
};
