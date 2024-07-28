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
var fs_exports = {};
__export(fs_exports, {
  createDirectory: () => createDirectory,
  getFileContent: () => getFileContent,
  getFileInfo: () => getFileInfo,
  remove: () => remove,
  writeFileContent: () => writeFileContent
});
module.exports = __toCommonJS(fs_exports);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
const getFileContent = (file, encoding = "utf8") => {
  const data = import_node_fs.default.readFileSync(file);
  return data.toString(encoding);
};
const writeFileContent = (file, content, { createDir = true } = {}) => {
  if (createDir) createDirectory(import_node_path.default.dirname(file));
  return import_node_fs.default.writeFileSync(file, content);
};
const getFileInfo = (file) => {
  let result = null;
  try {
    result = import_node_fs.default.statSync(file);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  return result;
};
const createDirectory = (dir) => {
  return import_node_fs.default.mkdirSync(dir, { recursive: true });
};
const remove = (fileOrDir) => {
  return import_node_fs.default.rmSync(fileOrDir, { recursive: true, force: true });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDirectory,
  getFileContent,
  getFileInfo,
  remove,
  writeFileContent
});
//# sourceMappingURL=fs.js.map
