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
var definitions_exports = {};
__export(definitions_exports, {
  install: () => install
});
module.exports = __toCommonJS(definitions_exports);
var import_cucumber = require("@cucumber/cucumber");
var import_chai = require("chai");
const install = () => {
  (0, import_cucumber.Given)(/^(?:I )?set (?:working directory|cwd) to (.+)$/, function(cwd) {
    this.cli.setCwd(cwd);
  });
  (0, import_cucumber.Given)(
    /^(?:I )?set ([^ ]+) (?:env|environment) (?:var|variable) to (.+)$/,
    function(name, value) {
      this.cli.setEnvironmentVariable(name, value);
    }
  );
  (0, import_cucumber.Given)(/^(?:I )?set (?:env|environment) (?:vars|variables)$/, function(step) {
    this.cli.setEnvironmentVariables(step.rowsHash());
  });
  (0, import_cucumber.Given)(/^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/, function(signal, _delay, unit) {
    let delay = Number(_delay);
    if (unit === "s") {
      delay = delay * 1e3;
    }
    this.cli.scheduleKillProcess(delay, signal);
  });
  (0, import_cucumber.When)(/^(?:I )?run command (.+)$/, function(command) {
    return this.cli.run(command);
  });
  (0, import_cucumber.When)(/^(?:I )?dump (stderr|stdout)$/, function(type) {
    const output = this.cli.getOutput(type);
    console.log(output);
  });
  (0, import_cucumber.Then)(/^(?:the )?(?:command )?exit code should be (\d+)$/, function(expectedExitCode) {
    const exitCode = this.cli.getExitCode();
    (0, import_chai.expect)(
      exitCode,
      `The command exit code doesn't match expected ${expectedExitCode}, found: ${exitCode}`
    ).to.equal(Number(expectedExitCode));
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) should be empty$/, function(type) {
    const output = this.cli.getOutput(type);
    (0, import_chai.expect)(output).to.be.empty;
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) should contain (.+)$/, function(type, expected) {
    const output = this.cli.getOutput(type);
    (0, import_chai.expect)(output).to.contain(expected);
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) should not contain (.+)$/, function(type, expected) {
    const output = this.cli.getOutput(type);
    (0, import_chai.expect)(output).to.not.contain(expected);
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) should match (.+)$/, function(type, regex) {
    const output = this.cli.getOutput(type);
    (0, import_chai.expect)(output).to.match(new RegExp(regex, "gim"));
  });
  (0, import_cucumber.Then)(/^(stderr|stdout) should not match (.+)$/, function(type, regex) {
    const output = this.cli.getOutput(type);
    (0, import_chai.expect)(output).to.not.match(new RegExp(regex, "gim"));
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  install
});
