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
var file_system_exports = {};
__export(file_system_exports, {
  createDirectory: () => createDirectory,
  getFileContent: () => getFileContent,
  getFileInfo: () => getFileInfo,
  remove: () => remove
});
module.exports = __toCommonJS(file_system_exports);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
const getFileContent = (cwd, file, encoding = "utf8") => new Promise((resolve, reject) => {
  import_node_fs.default.readFile(import_node_path.default.join(cwd, file), (err, data) => {
    if (err) return reject(err);
    resolve(data.toString(encoding));
  });
});
const getFileInfo = (cwd, file) => new Promise((resolve, reject) => {
  import_node_fs.default.stat(import_node_path.default.join(cwd, file), (err, stat) => {
    if (err) {
      if (err.code === "ENOENT") return resolve(null);
      return reject(err);
    }
    resolve(stat);
  });
});
const createDirectory = (cwd, directory) => import_node_fs.default.mkdirSync(import_node_path.default.join(cwd, directory), { recursive: true });
const remove = (cwd, fileOrDirectory) => import_node_fs.default.rmSync(import_node_path.default.join(cwd, fileOrDirectory), { recursive: true, force: true });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDirectory,
  getFileContent,
  getFileInfo,
  remove
});
