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
var command_line_exports = {};
__export(command_line_exports, {
  hasArg: () => hasArg,
  hasOneArgOf: () => hasOneArgOf
});
module.exports = __toCommonJS(command_line_exports);
const hasArg = (arg) => process.argv.includes(arg);
const hasOneArgOf = (args) => Array.isArray(args) ? args.some((arg) => process.argv.includes(arg)) : false;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hasArg,
  hasOneArgOf
});
