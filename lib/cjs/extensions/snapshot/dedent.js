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
var dedent_exports = {};
__export(dedent_exports, {
  default: () => dedent_default
});
module.exports = __toCommonJS(dedent_exports);
const getSpacesLength = (text) => {
  let length = 0;
  while (length < text.length) {
    const char = text[length];
    if (char !== " " && char !== "	") break;
    length += 1;
  }
  return length;
};
const dedent = (text) => {
  if (typeof text !== "string") text = text[0];
  let lines = text.split("\n");
  if (lines.length < 3) return text;
  lines = lines.slice(1, lines.length - 1);
  let skipLength = getSpacesLength(lines[0]);
  if (lines[0].substr(skipLength, 3) === '"""' && lines[lines.length - 1].substr(skipLength, 3) === '"""') {
    lines = lines.slice(1, lines.length - 1);
  } else {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      skipLength = Math.min(skipLength, getSpacesLength(line));
    }
  }
  const resultLines = [];
  for (let i = 0; i < lines.length; i++) {
    resultLines.push(lines[i].substring(skipLength));
  }
  return resultLines.join("\n");
};
var dedent_default = dedent;
//# sourceMappingURL=dedent.js.map
