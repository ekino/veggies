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
var cmd_options_exports = {};
__export(cmd_options_exports, {
  cleanSnapshots: () => cleanSnapshots,
  preventSnapshotsCreation: () => preventSnapshotsCreation,
  updateSnapshots: () => updateSnapshots
});
module.exports = __toCommonJS(cmd_options_exports);
var import_command_line = require("../../utils/command_line.js");
let cleanSnapshots = false;
let updateSnapshots = false;
let preventSnapshotsCreation = false;
if ((0, import_command_line.hasOneArgOf)(["--updateSnapshots", "-u"])) {
  updateSnapshots = true;
}
if ((0, import_command_line.hasArg)("--cleanSnapshots")) {
  cleanSnapshots = true;
}
if ((0, import_command_line.hasArg)("--preventSnapshotsCreation")) {
  preventSnapshotsCreation = true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cleanSnapshots,
  preventSnapshotsCreation,
  updateSnapshots
});
//# sourceMappingURL=cmd_options.js.map
