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
var statistics_exports = {};
__export(statistics_exports, {
  created: () => created,
  default: () => statistics_default,
  printReport: () => printReport,
  removed: () => removed,
  updated: () => updated
});
module.exports = __toCommonJS(statistics_exports);
var import_colors = require("../../utils/colors.js");
const created = [];
const updated = [];
const removed = [];
const printReport = () => {
  const total = created.length + updated.length + removed.length;
  if (total) {
    let result = "`\n\nSnapshots:   ";
    if (created.length > 0) result += `${import_colors.GREEN}${created.length} created${import_colors.RESET}, `;
    if (updated.length > 0) result += `${import_colors.YELLOW}${updated.length} updated${import_colors.RESET}, `;
    if (removed.length > 0) result += `${import_colors.RED}${removed.length} removed${import_colors.RESET}, `;
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
