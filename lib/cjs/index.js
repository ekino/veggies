"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var src_exports = {};
__export(src_exports, {
  assertions: () => assertions,
  cast: () => cast,
  cli: () => cli,
  fileSystem: () => fileSystem,
  fixtures: () => fixtures,
  httpApi: () => httpApi,
  snapshot: () => snapshot,
  state: () => state
});
module.exports = __toCommonJS(src_exports);
var state = __toESM(require("./extensions/state/index.js"), 1);
var fixtures = __toESM(require("./extensions/fixtures/index.js"), 1);
var httpApi = __toESM(require("./extensions/http_api/index.js"), 1);
var cli = __toESM(require("./extensions/cli/index.js"), 1);
var fileSystem = __toESM(require("./extensions/file_system/index.js"), 1);
var snapshot = __toESM(require("./extensions/snapshot/index.js"), 1);
var cast = __toESM(require("./core/cast.js"), 1);
var assertions = __toESM(require("./core/assertions.js"), 1);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assertions,
  cast,
  cli,
  fileSystem,
  fixtures,
  httpApi,
  snapshot,
  state
});
