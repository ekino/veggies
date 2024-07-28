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
var utils_exports = {};
__export(utils_exports, {
  findKey: () => findKey,
  getValue: () => getValue,
  isDefined: () => isDefined,
  isEmpty: () => isEmpty,
  isFunction: () => isFunction,
  isNumber: () => isNumber,
  isPlainObject: () => isPlainObject,
  isString: () => isString,
  mapValues: () => mapValues,
  omit: () => omit,
  partial: () => partial,
  pick: () => pick,
  setValue: () => setValue,
  template: () => template
});
module.exports = __toCommonJS(utils_exports);
const isNumber = (n) => Number.isFinite(n);
const isEmpty = (val) => {
  if (val == null) return true;
  if (typeof val === "string" || Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
};
const isDefined = (val) => !!val;
const isString = (val) => typeof val === "string";
const isFunction = (func) => typeof func === "function";
const getValue = (obj, path, defaultValue = void 0) => {
  if (obj == null) return defaultValue;
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  return pathArray.reduce((acc, key) => {
    if (acc == null || !(key in acc)) {
      return defaultValue;
    }
    return acc[key];
  }, obj);
};
const setValue = (obj, path, value) => {
  if (!obj || typeof obj !== "object") return obj;
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  pathArray.reduce((acc, key, idx) => {
    if (idx === pathArray.length - 1) {
      acc[key] = value;
    } else {
      if (!acc[key] || typeof acc[key] !== "object") {
        acc[key] = {};
      }
    }
    return acc[key];
  }, obj);
  return obj;
};
const isPlainObject = (value) => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};
const template = (tpl, options = {}) => {
  const defaultPattern = /\${(.*?)}/g;
  const pattern = options.interpolate || defaultPattern;
  return (data) => tpl.replace(pattern, (_match, key) => {
    const trimmedKey = key.trim();
    return data[trimmedKey] !== void 0 ? data[trimmedKey] : "";
  });
};
const mapValues = (obj, fn) => Object.entries(obj).reduce((acc, [key, value]) => {
  acc[key] = fn(value);
  return acc;
}, {});
const findKey = (obj, predicate) => Object.keys(obj).find((key) => predicate(obj[key]));
const pick = (obj, keys) => {
  if (obj == null) return {};
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
const omit = (obj, keys) => {
  if (obj == null) return {};
  return Object.keys(obj).filter((key) => !keys.includes(key)).reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
};
const partial = (fn, ...partials) => (...args) => fn(...partials, ...args);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findKey,
  getValue,
  isDefined,
  isEmpty,
  isFunction,
  isNumber,
  isPlainObject,
  isString,
  mapValues,
  omit,
  partial,
  pick,
  setValue,
  template
});
