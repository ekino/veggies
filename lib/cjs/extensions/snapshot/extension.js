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
var extension_exports = {};
__export(extension_exports, {
  Snapshot: () => Snapshot,
  default: () => extension_default
});
module.exports = __toCommonJS(extension_exports);
var import_pretty_format = require("pretty-format");
var snapshot = __toESM(require("./snapshot.js"), 1);
var clean = __toESM(require("./clean.js"), 1);
var statistics = __toESM(require("./statistics.js"), 1);
var assertions = __toESM(require("../../core/assertions.js"), 1);
var import_utils = require("../../utils/index.js");
class Snapshot {
  /**
   * @param {Object} options - Options
   * @param {boolean} [options.updateSnapshots=false] - Should we update the snapshots
   * @param {boolean} [options.cleanSnapshots=false] - Should we clean the snapshot to remove unused snapshots
   * @param {boolean} [options.preventSnapshotsCreation=false] - Should we avoid creating missing snapshots
   */
  constructor(options) {
    this.options = options || {};
    this.shouldUpdate = this.options.updateSnapshots;
    this.cleanSnapshots = this.options.cleanSnapshots;
    this.preventSnapshotsCreation = this.options.preventSnapshotsCreation;
    this.featureFile = null;
    this.scenarioLine = -1;
    this._snapshotsCount = 0;
  }
  /**
   * When you do snapshots, it happens that some fields change at each snapshot check (ids, dates ...).
   * This work the same way as expectToMath but allow you to check some fields in a json objects against a matcher
   * and ignore them in the snapshot diff replacing them with a generic value.
   * @param {*} expectedContent - Content to compare to snapshot
   * @param {ObjectFieldSpec[]} spec  - specification
   * @throws {string} If snapshot and expected content doesn't match, it throws diff between both
   */
  expectToMatchJson(expectedContent, spec) {
    assertions.assertObjectMatchSpec(expectedContent, spec);
    const copy = structuredClone(expectedContent);
    spec.forEach(({ field, matcher, value }) => {
      (0, import_utils.setValue)(copy, field, `${matcher}(${value})`);
    });
    this.expectToMatch(copy);
  }
  /**
   * Compare a content to it's snapshot.
   * If no snapshot yet, it create it.
   *
   * It uses the context to name the snapshot: feature file, scenario name and nth snapshot of scenario
   * Snapshot name will be by default stored in FEATURE_FILE_FOLDER_PATH/__snapshots__/FEATURE_FILE_NAME.snap
   * And snapshot name will be "SCENARIO_NAME NUMBER_OF_TIME_SCNEARIO_NAME_APPEARD_IN_FEATURE.NUMBER_OF_TIME_WE_SNAPSHOTED_IN_CURRENT_SCENARIO"
   * For the first scenario of a scenario called "Scenario 1" that only appears once in feature file,
   * snapshot name will be "Scenario 1 1.1"
   *
   * If option "-u" or "--updateSnapshots" is used, all snapshots will be updated
   * If options "--cleanSnapshots" is used, unused stored snapshots will be removed.
   * @param {*} expectedContent - Content to compare to snapshot
   * @throws {string} If snapshot and expected content doesn't match, it throws diff between both
   */
  expectToMatch(expectedContent) {
    expectedContent = (0, import_pretty_format.format)(expectedContent);
    expectedContent = snapshot.normalizeNewlines(expectedContent);
    let snapshotsFile = snapshot.snapshotsPath(this.featureFile, this.options);
    const scenarios = snapshot.extractScenarios(this.featureFile);
    const snapshotsPrefix = snapshot.prefixSnapshots(scenarios)[this.scenarioLine];
    if (!snapshotsPrefix)
      throw new Error(
        `Can not do a snapshot. Scenario not found in file ${this.featureFile} on line ${this.scenarioLine}`
      );
    this._snapshotsCount += 1;
    const snapshotName = `${snapshotsPrefix.prefix}.${this._snapshotsCount}`;
    if (this.cleanSnapshots) clean.referenceSnapshot(snapshotsFile, snapshotName);
    const snapshotsContents = snapshot.readSnapshotFile(snapshotsFile);
    let snapshotContent = snapshotsContents[snapshotName];
    if (this.preventSnapshotsCreation && !snapshotContent)
      throw new Error("The snapshot does not exist and won't be created.");
    if (!snapshotContent) {
      statistics.created.push({ file: this.featureFile, name: snapshotName });
    } else if (this.shouldUpdate) {
      statistics.updated.push({ file: this.featureFile, name: snapshotName });
    }
    if (!snapshotContent || this.shouldUpdate) {
      snapshotsContents[snapshotName] = expectedContent;
      snapshot.writeSnapshotFile(snapshotsFile, snapshotsContents);
      snapshotContent = expectedContent;
    }
    const diff = snapshot.diff(snapshotContent, expectedContent);
    if (diff) throw new Error(diff);
  }
}
function extension_default(...args) {
  return new Snapshot(...args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Snapshot
});
