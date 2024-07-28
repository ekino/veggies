"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var definitions_exports = {};
__export(definitions_exports, {
  install: () => install
});
module.exports = __toCommonJS(definitions_exports);
var import_cucumber = require("@cucumber/cucumber");
const install = () => {
  (0, import_cucumber.Then)(/^response body should match snapshot$/, function() {
    this.snapshot.expectToMatch(this.httpApiClient.getResponse().body);
  });
  (0, import_cucumber.Then)(/^response json body should match snapshot$/, function(table) {
    let spec = [];
    if (table) {
      spec = table.hashes().map((fieldSpec) => ({
        ...fieldSpec,
        value: this.state.populate(fieldSpec.value)
      }));
    }
    this.snapshot.expectToMatchJson(this.httpApiClient.getResponse().body, spec);
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) output should match snapshot$/, function(type) {
    this.snapshot.expectToMatch(this.cli.getOutput(type));
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) json output should match snapshot$/, function(type, table) {
    let spec = [];
    if (table) {
      spec = table.hashes().map((fieldSpec) => ({
        ...fieldSpec,
        value: this.state.populate(fieldSpec.value)
      }));
    }
    const output = JSON.parse(this.cli.getOutput(type));
    this.snapshot.expectToMatchJson(output, spec);
  });
  (0, import_cucumber.Then)(/^file (.+) should match snapshot$/, function(file) {
    return this.fileSystem.getFileContent(this.cli.getCwd(), file).then((content) => {
      this.snapshot.expectToMatch(content);
    });
  });
  (0, import_cucumber.Then)(/^json file (.+) content should match snapshot$/, function(file, table) {
    let spec = [];
    if (table) {
      spec = table.hashes().map((fieldSpec) => ({
        ...fieldSpec,
        value: this.state.populate(fieldSpec.value)
      }));
    }
    return this.fileSystem.getFileContent(this.cli.getCwd(), file).then((content) => {
      const parsedContent = JSON.parse(content);
      this.snapshot.expectToMatchJson(parsedContent, spec);
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});
