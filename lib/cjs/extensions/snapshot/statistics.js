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
var statistics_exports = {};
__export(statistics_exports, {
  created: () => created,
  default: () => statistics_default,
  printReport: () => printReport,
  removed: () => removed,
  updated: () => updated
});
module.exports = __toCommonJS(statistics_exports);
var import_chalk = __toESM(require("chalk"), 1);
const created = [];
const updated = [];
const removed = [];
const printReport = () => {
  const total = created.length + updated.length + removed.length;
  if (total) {
    let result = "`\n\nSnapshots:   ";
    if (created.length > 0) result += import_chalk.default.green(`${created.length} created, `);
    if (updated.length > 0) result += import_chalk.default.yellow(`${updated.length} updated, `);
    if (removed.length > 0) result += import_chalk.default.red(`${removed.length} removed, `);
    result += `${total} total
`;
    console.log(result);
  }
};
var statistics_default = { created, updated, removed, printReport };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  created,
  printReport,
  removed,
  updated
});
//# sourceMappingURL=statistics.js.map
