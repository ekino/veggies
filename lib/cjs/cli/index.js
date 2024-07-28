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
var cli_exports = {};
__export(cli_exports, {
  run: () => run
});
module.exports = __toCommonJS(cli_exports);
var import_arg = __toESM(require("arg"), 1);
var import_module = require("module");
const import_meta = {};
const CucumberCli = (0, import_module.createRequire)(import_meta.url)("@cucumber/cucumber/lib/cli/index").default;
const veggiesArgsDefinitions = {
  "--cleanSnapshots": Boolean,
  "--updateSnapshots": Boolean,
  "-u": "--updateSnapshots",
  "--preventSnapshotsCreation": Boolean
};
const printHelp = () => {
  console.log("veggies help");
  console.log(`
Options:
  --cleanSnapshots            removes unused snapshots (not recommended while matching tags)
  -u, --updateSnapshots       updates current snapshots if required
  --preventSnapshotsCreation  a snapshot related step that would create one will fail instead (useful on CI environment)
  
For more details please visit https://github.com/ekino/veggies/blob/master/README.md
    `);
  console.log("cucumber-js help\n");
};
const run = async (argv) => {
  const { _: cucumberArgs } = (0, import_arg.default)(veggiesArgsDefinitions, { argv, permissive: true });
  try {
    if (cucumberArgs.includes("--help")) {
      printHelp();
    }
    const result = await new CucumberCli({
      argv: cucumberArgs,
      cwd: process.cwd(),
      stdout: process.stdout,
      stderr: process.stderr,
      env: process.env
    }).run();
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
