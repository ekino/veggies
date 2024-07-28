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
var fixtures_loader_exports = {};
__export(fixtures_loader_exports, {
  Fixture: () => FixturesLoader,
  default: () => fixtures_loader_default
});
module.exports = __toCommonJS(fixtures_loader_exports);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_fast_glob = __toESM(require("fast-glob"), 1);
var import_url = require("url");
var import_js_yaml = __toESM(require("js-yaml"), 1);
class FixturesLoader {
  /**
   * @param {string} [fixturesDir='fixtures'] - The name of the fixtures directory relative to feature
   */
  constructor({ fixturesDir } = { fixturesDir: "fixtures" }) {
    this.fixturesDir = fixturesDir;
    this.featureUri = void 0;
  }
  /**
   * Configures the loader
   *
   * @param {string} [fixturesDir='fixtures'] - The name of the fixtures directory relative to feature
   */
  configure({ fixturesDir } = { fixturesDir: "fixtures" }) {
    this.fixturesDir = fixturesDir;
  }
  /**
   * Sets feature uri, used to resolve fixtures files.
   * When trying to load a fixture file the path will be comprised of:
   * - feature uri
   * - fixturesDir
   * - fixture name
   *
   * @param {string} featureUri - Feature uri
   */
  setFeatureUri(featureUri) {
    this.featureUri = featureUri;
  }
  /**
   * Loads content from file.
   *
   * @param {string} file - File path
   * @return {Promise.<string>} File content
   */
  loadText(file) {
    return new Promise((resolve, reject) => {
      import_node_fs.default.readFile(file, (err, data) => {
        if (err) return reject(err);
        resolve(data.toString("utf8"));
      });
    });
  }
  /**
   * Loads content from yaml file.
   *
   * @param {string} file - File path
   * @return {Promise.<Object|Array>} Parsed yaml data
   */
  loadYaml(file) {
    return this.loadText(file).then((content) => {
      try {
        const data = import_js_yaml.default.load(content);
        if (data === void 0) {
          return Promise.reject(
            new Error(
              `Fixture file is invalid, yaml parsing resulted in undefined data for file: ${file}`
            )
          );
        }
        return data;
      } catch (err) {
        return Promise.reject(
          new Error(`Unable to parse yaml fixture file: ${file}.
error: ${err.message}`)
        );
      }
    });
  }
  /**
   * Loads content from json file.
   *
   * @param {string} file - File path
   * @return {Promise.<Object>} Json data
   */
  loadJson(file) {
    return this.loadText(file).then((content) => {
      try {
        const data = JSON.parse(content);
        return data;
      } catch (err) {
        return Promise.reject(
          new Error(`Unable to parse json fixture file: ${file}.
error: ${err.message}`)
        );
      }
    });
  }
  /**
   * Loads content from javascript module.
   *
   * @param {string} file - File path
   * @return {Promise.<*>} Data generated from the module
   */
  loadModule(file) {
    const moduleURL = (0, import_url.pathToFileURL)(import_node_path.default.resolve(file)).href;
    return import(moduleURL).then((mod) => {
      if (typeof mod.default !== "function") {
        return Promise.reject(
          new Error(
            [
              `JavaScript fixture file should export default function.
`,
              `Make sure you declared 'export default function' in ${file}`
            ].join("")
          )
        );
      }
      return mod.default();
    }).catch((err) => {
      return Promise.reject(
        new Error(
          `An error occurred while loading fixture file: ${file}
error: ${err.message}`
        )
      );
    });
  }
  /**
   * Tries to load a fixture from current feature directory.
   * Will search for the following file extensions:
   * - yaml
   * - yml
   * - js
   * - json
   * - txt
   *
   * @param {string} fixture - Fixture file name without extension
   * @return {Promise.<Object|string>} Fixture content
   */
  load(fixture) {
    if (this.featureUri === void 0)
      return Promise.reject(
        new Error(`Cannot load fixture: ${fixture}, no feature uri defined`)
      );
    const featureDir = import_node_path.default.dirname(this.featureUri);
    const pattern = `${featureDir}/${this.fixturesDir}/${fixture}.@(yaml|yml|js|json|txt)`;
    return new Promise((resolve, reject) => {
      const files = import_fast_glob.default.sync(pattern);
      const fixturesCount = files.length;
      if (fixturesCount === 0)
        return reject(new Error(`No fixture found for: ${fixture} (${pattern})`));
      if (fixturesCount > 1) {
        return reject(
          new Error(
            [
              `Found ${fixturesCount} matching fixture files, `,
              `you should have only one matching '${fixture}', matches:
  `,
              `- ${files.join("\n  - ")}`
            ].join("")
          )
        );
      }
      const fixtureFile = files[0];
      const ext = import_node_path.default.extname(fixtureFile).substring(1);
      switch (ext) {
        case "yml":
        case "yaml":
          return resolve(this.loadYaml(fixtureFile));
        case "js":
          return resolve(this.loadModule(fixtureFile));
        case "json":
          return resolve(this.loadJson(fixtureFile));
        default:
          return resolve(this.loadText(fixtureFile));
      }
    });
  }
  /**
   * Resets fixtures loader.
   */
  reset() {
    this.featureUri = void 0;
  }
}
function fixtures_loader_default(...args) {
  return new FixturesLoader(...args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fixture
});
