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
var hooks_exports = {};
__export(hooks_exports, {
  install: () => install
});
module.exports = __toCommonJS(hooks_exports);
var import_cucumber = require("@cucumber/cucumber");
var clean = __toESM(require("./clean.js"), 1);
var cmdOptions = __toESM(require("./cmd_options.js"), 1);
var statistics = __toESM(require("./statistics.js"), 1);
const getCurrentScenarioLineNumber = ({ gherkinDocument, pickle }) => {
  const currentScenarioId = pickle.astNodeIds[0];
  const { scenario } = gherkinDocument.feature.children.find(
    ({ scenario: { id } }) => id === currentScenarioId
  );
  return scenario.location.line;
};
const install = () => {
  (0, import_cucumber.Before)(function(scenarioInfos) {
    const file = scenarioInfos.gherkinDocument.uri;
    const line = getCurrentScenarioLineNumber(scenarioInfos);
    this.snapshot.featureFile = file;
    this.snapshot.scenarioLine = line;
  });
  (0, import_cucumber.BeforeAll)(function() {
    clean.resetReferences();
  });
  (0, import_cucumber.AfterAll)(function() {
    if (cmdOptions.cleanSnapshots) clean.cleanSnapshots();
    statistics.printReport();
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});
