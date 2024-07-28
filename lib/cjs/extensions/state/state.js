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
var state_exports = {};
__export(state_exports, {
  State: () => State,
  default: () => state_default
});
module.exports = __toCommonJS(state_exports);
var import_utils = require("../../utils/index.js");
class State {
  constructor() {
    this.state = {};
  }
  /**
   * Sets value for given key.
   *
   * @param {string} key   - The key you wish to set a value for
   * @param {*}      value - The value
   */
  set(key, value) {
    return (0, import_utils.setValue)(this.state, key, value);
  }
  /**
   * Retrieves a value for given key.
   *
   * @param {string} key - The key you wish to retrieve a value for
   * @return {*}
   */
  get(key) {
    return (0, import_utils.getValue)(this.state, key);
  }
  /**
   * Clear the state
   */
  clear() {
    this.state = {};
  }
  /**
   * Dump state content
   * @return {Object|{}|*}
   */
  dump() {
    return this.state;
  }
  populate(value) {
    return (0, import_utils.template)(value, { interpolate: /{{([\s\S]+?)}}/g })(this.state);
  }
  populateObject(object) {
    return (0, import_utils.mapValues)(object, (value) => {
      if ((0, import_utils.isPlainObject)(value)) return this.populateObject(value);
      return this.populate(value);
    });
  }
}
function state_default(...args) {
  return new State(...args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  State
});
