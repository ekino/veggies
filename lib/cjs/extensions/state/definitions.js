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
var definitions_exports = {};
__export(definitions_exports, {
  install: () => install
});
module.exports = __toCommonJS(definitions_exports);
var import_cucumber = require("@cucumber/cucumber");
var Cast = __toESM(require("../../core/cast.js"), 1);
const install = () => {
  (0, import_cucumber.Given)(/^(?:I )?set state (.+) to (.+)$/, (key, value) => {
    import_cucumber.world.state.set(key, Cast.getCastedValue(value));
  });
  (0, import_cucumber.When)(/^(?:I )?clear state$/, () => {
    import_cucumber.world.state.clear();
  });
  (0, import_cucumber.When)(/^(?:I )?dump state$/, () => {
    console.log(import_cucumber.world.state.dump());
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});
