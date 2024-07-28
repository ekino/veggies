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
var cast_exports = {};
__export(cast_exports, {
  addType: () => addType,
  getCastedArray: () => getCastedArray,
  getCastedObject: () => getCastedObject,
  getCastedObjects: () => getCastedObjects,
  getCastedValue: () => getCastedValue
});
module.exports = __toCommonJS(cast_exports);
var import_utils = require("../utils/index.js");
const castFunctions = {};
castFunctions["undefined"] = () => {
  return void 0;
};
castFunctions["null"] = () => {
  return null;
};
castFunctions["number"] = (value) => {
  const result = Number(value);
  if (Number.isNaN(result)) {
    throw new TypeError(`Unable to cast value to number '${value}'`);
  }
  return result;
};
castFunctions["boolean"] = (value) => {
  return value === "true";
};
castFunctions["array"] = (value) => {
  return value ? value.replace(/\s/g, "").split(",").map(getCastedValue) : [];
};
castFunctions["date"] = (value) => {
  if (value === "today") {
    return (/* @__PURE__ */ new Date()).toJSON().slice(0, 10);
  }
  return new Date(value).toJSON();
};
castFunctions["string"] = (value) => {
  return `${value}`;
};
const addType = (typeName, castFunction) => {
  if (!(0, import_utils.isFunction)(castFunction))
    throw new TypeError(
      `Invalid cast function provided, must be a function (${typeof castFunction})`
    );
  castFunctions[typeName] = castFunction;
};
const getCastedValue = (value) => {
  if (!(0, import_utils.isString)(value)) return value;
  const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/);
  if (matchResult) {
    const type = matchResult[2];
    const castFunction = castFunctions[type];
    if (!castFunction) throw new TypeError(`Invalid type provided: ${type} '${value}'`);
    return castFunction(matchResult[1]);
  }
  return value;
};
const getCastedObject = (object) => {
  const castedObject = {};
  Object.keys(object).forEach((key) => {
    (0, import_utils.setValue)(castedObject, key, getCastedValue(object[key]));
  });
  return castedObject;
};
const getCastedObjects = (objects) => objects.map((object) => getCastedObject(object));
const getCastedArray = (array) => array.map((value) => getCastedValue(value));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addType,
  getCastedArray,
  getCastedObject,
  getCastedObjects,
  getCastedValue
});
