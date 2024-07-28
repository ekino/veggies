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
var snapshot_exports = {};
__export(snapshot_exports, {
  diff: () => diff,
  extractScenarios: () => extractScenarios,
  formatSnapshotFile: () => formatSnapshotFile,
  normalizeNewlines: () => normalizeNewlines,
  parseSnapshotFile: () => parseSnapshotFile,
  prefixSnapshots: () => prefixSnapshots,
  readSnapshotFile: () => readSnapshotFile,
  scenarioRegex: () => scenarioRegex,
  snapshotsPath: () => snapshotsPath,
  wrapWithBacktick: () => wrapWithBacktick,
  writeSnapshotFile: () => writeSnapshotFile
});
module.exports = __toCommonJS(snapshot_exports);
var import_node_path = __toESM(require("node:path"), 1);
var import_jest_diff = require("jest-diff");
var import_natural_compare = __toESM(require("natural-compare"), 1);
var import_colors = require("../../utils/colors.js");
var fileSystem = __toESM(require("./fs.js"), 1);
const JEST_NO_DIFF_MESSAGE = "Compared values have no visual difference.";
const scenarioRegex = /^[\s]*Scenario:[\s]*(.*[^\s])[\s]*$/;
const extractScenarios = (file) => {
  if (!file) {
    throw new TypeError(`Invalid feature file ${file}`);
  }
  const content = fileSystem.getFileContent(file);
  const linesContent = content.split("\n");
  return linesContent.map((lineContent, idx) => {
    const line = idx + 1;
    const scenarioInfos = scenarioRegex.exec(lineContent);
    if (scenarioInfos) {
      return { line, name: scenarioInfos[1] };
    }
    return void 0;
  }).filter((item) => !!item);
};
const prefixSnapshots = (scenarios) => {
  if (!scenarios) {
    throw new Error(`Scenarios are required to prefix snapshots`);
  }
  const nameCount = /* @__PURE__ */ new Map();
  return scenarios.reduce((acc, scenario) => {
    const count = nameCount.get(scenario.name) || 0;
    nameCount.set(scenario.name, count + 1);
    const prefix = `${scenario.name} ${count + 1}`;
    acc[scenario.line] = { name: scenario.name, line: scenario.line, prefix };
    return acc;
  }, {});
};
const readSnapshotFile = (file) => {
  if (!file) {
    throw new Error(`Missing snapshot file ${file} to read snapshots`);
  }
  const info = fileSystem.getFileInfo(file);
  if (!info) return {};
  const content = fileSystem.getFileContent(file);
  return parseSnapshotFile(content);
};
const writeSnapshotFile = (file, content) => {
  const serializedContent = formatSnapshotFile(content);
  return fileSystem.writeFileContent(file, serializedContent);
};
const snapshotsPath = (featureFile, opts) => {
  const dirname = opts.snaphotsDirname || "__snapshots__";
  const dir = import_node_path.default.join(import_node_path.default.dirname(featureFile), dirname);
  const filename = `${import_node_path.default.basename(featureFile)}.${opts.snapshotsFileExtension || "snap"}`;
  return import_node_path.default.join(dir, filename);
};
const diff = (snapshot, expected) => {
  let diffMessage = (0, import_jest_diff.diff)(snapshot, expected, {
    expand: false,
    colors: true,
    //contextLines: -1, // Forces to use default from Jest
    aAnnotation: "Snapshot",
    bAnnotation: "Received"
  });
  diffMessage = diffMessage || `${import_colors.GREEN}- ${expected || ""}${import_colors.RESET} 
 ${import_colors.RED}+ ${snapshot}${import_colors.RESET}`;
  if (diffMessage.indexOf(JEST_NO_DIFF_MESSAGE) !== -1) return null;
  return `
${diffMessage}`;
};
const wrapWithBacktick = (str) => {
  return "`" + str.replace(/`|\\|\${/g, "\\$&") + "`";
};
const normalizeNewlines = (string) => {
  return string.replace(/\r\n|\r/g, "\n");
};
const formatSnapshotFile = (content) => {
  const snapshots = Object.keys(content).sort(import_natural_compare.default).map(
    (key) => "exports[" + wrapWithBacktick(key) + "] = " + wrapWithBacktick(normalizeNewlines(content[key])) + ";"
  );
  return "\n\n" + snapshots.join("\n\n") + "\n";
};
const parseSnapshotFile = (content) => {
  const data = {};
  const populate = new Function("exports", content);
  populate(data);
  return data;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  diff,
  extractScenarios,
  formatSnapshotFile,
  normalizeNewlines,
  parseSnapshotFile,
  prefixSnapshots,
  readSnapshotFile,
  scenarioRegex,
  snapshotsPath,
  wrapWithBacktick,
  writeSnapshotFile
});
