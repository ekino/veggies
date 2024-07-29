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
  (0, import_cucumber.Then)(/^response body should match snapshot$/, () => {
    import_cucumber.world.snapshot.expectToMatch(import_cucumber.world.httpApiClient.getResponse().body);
  });
  (0, import_cucumber.Then)(/^response json body should match snapshot$/, (table) => {
    let spec = [];
    if (table) {
      spec = table.hashes().map((fieldSpec) => ({
        ...fieldSpec,
        value: import_cucumber.world.state.populate(fieldSpec.value)
      }));
    }
    import_cucumber.world.snapshot.expectToMatchJson(import_cucumber.world.httpApiClient.getResponse().body, spec);
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) output should match snapshot$/, (type) => {
    import_cucumber.world.snapshot.expectToMatch(import_cucumber.world.cli.getOutput(type));
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) json output should match snapshot$/, (type, table) => {
    let spec = [];
    if (table) {
      spec = table.hashes().map((fieldSpec) => ({
        ...fieldSpec,
        value: import_cucumber.world.state.populate(fieldSpec.value)
      }));
    }
    const output = JSON.parse(import_cucumber.world.cli.getOutput(type));
    import_cucumber.world.snapshot.expectToMatchJson(output, spec);
  });
  (0, import_cucumber.Then)(/^file (.+) should match snapshot$/, (file) => {
    return import_cucumber.world.fileSystem.getFileContent(import_cucumber.world.cli.getCwd(), file).then((content) => {
      import_cucumber.world.snapshot.expectToMatch(content);
    });
  });
  (0, import_cucumber.Then)(/^json file (.+) content should match snapshot$/, (file, table) => {
    let spec = [];
    if (table) {
      spec = table.hashes().map((fieldSpec) => ({
        ...fieldSpec,
        value: import_cucumber.world.state.populate(fieldSpec.value)
      }));
    }
    return import_cucumber.world.fileSystem.getFileContent(import_cucumber.world.cli.getCwd(), file).then((content) => {
      const parsedContent = JSON.parse(content);
      import_cucumber.world.snapshot.expectToMatchJson(parsedContent, spec);
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});
