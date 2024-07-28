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
var colors_exports = {};
__export(colors_exports, {
  GREEN: () => GREEN,
  RED: () => RED,
  RESET: () => RESET,
  YELLOW: () => YELLOW
});
module.exports = __toCommonJS(colors_exports);
const GREEN = "\x1B[32m";
const RED = "\x1B[31m";
const RESET = "\x1B[0m";
const YELLOW = "\x1B[33m";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GREEN,
  RED,
  RESET,
  YELLOW
});
