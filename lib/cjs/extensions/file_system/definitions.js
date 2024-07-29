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
var import_chai = require("chai");
const install = () => {
  (0, import_cucumber.Given)(/^(?:I )?create directory (.+)$/, (directory) => {
    return import_cucumber.world.fileSystem.createDirectory(import_cucumber.world.cli.getCwd(), directory);
  });
  (0, import_cucumber.Given)(/^(?:I )?remove (?:file|directory) (.+)$/, (fileOrDirectory) => {
    return import_cucumber.world.fileSystem.remove(import_cucumber.world.cli.getCwd(), fileOrDirectory);
  });
  (0, import_cucumber.Then)(/^(file|directory) (.+) should (not )?exist$/, (type, file, flag) => {
    return import_cucumber.world.fileSystem.getFileInfo(import_cucumber.world.cli.getCwd(), file).then((info) => {
      if (flag === "not ") {
        (0, import_chai.expect)(info, `${type} '${file}' exists`).to.be.null;
      } else {
        (0, import_chai.expect)(info, `${type} '${file}' does not exist`).not.to.be.null;
        if (type === "file") {
          (0, import_chai.expect)(info.isFile(), `'${file}' is not a file`).to.be.true;
        } else {
          (0, import_chai.expect)(info.isDirectory(), `'${file}' is not a directory`).to.be.true;
        }
      }
    });
  });
  (0, import_cucumber.Then)(
    /^file (.+) content should (not )?(equal|contain|match) (.+)$/,
    (file, flag, comparator, expectedValue) => {
      return import_cucumber.world.fileSystem.getFileContent(import_cucumber.world.cli.getCwd(), file).then((content) => {
        let expectFn = (0, import_chai.expect)(
          content,
          `Expected file '${file}' to ${flag ? flag : ""}${comparator} '${expectedValue}', but found '${content}' which does${flag ? "" : " not"}`
        ).to;
        if (flag != void 0) {
          expectFn = expectFn.not;
        }
        expectFn[comparator](
          comparator === "match" ? new RegExp(expectedValue) : expectedValue
        );
      }).catch((err) => {
        if (err.code === "ENOENT")
          return import_chai.expect.fail("", "", `File '${file}' should exist`);
        return Promise.reject(err);
      });
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});
