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
var clean_exports = {};
__export(clean_exports, {
  _snapshots: () => _snapshots,
  cleanSnapshots: () => cleanSnapshots,
  referenceSnapshot: () => referenceSnapshot,
  resetReferences: () => resetReferences
});
module.exports = __toCommonJS(clean_exports);
var snapshot = __toESM(require("./snapshot.js"), 1);
var fileSystem = __toESM(require("./fs.js"), 1);
var statistics = __toESM(require("./statistics.js"), 1);
var import_utils = require("../../utils/index.js");
let _snapshots = {};
const referenceSnapshot = function(file, snapshotName) {
  _snapshots[file] = _snapshots[file] || [];
  _snapshots[file].push(snapshotName);
};
const resetReferences = function() {
  _snapshots = {};
};
const cleanSnapshots = function() {
  Object.entries(_snapshots).forEach(([file, snapshotNames]) => {
    if ((0, import_utils.isEmpty)(snapshotNames)) {
      fileSystem.remove(file);
      return true;
    }
    const content = snapshot.readSnapshotFile(file);
    const newContent = (0, import_utils.pick)(content, snapshotNames);
    snapshot.writeSnapshotFile(file, newContent);
    const omittedContent = (0, import_utils.omit)(content, snapshotNames);
    Object.entries(omittedContent).forEach(([snapshotName, _snapshotContent]) => {
      statistics.removed.push({ file, name: snapshotName });
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _snapshots,
  cleanSnapshots,
  referenceSnapshot,
  resetReferences
});
