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
  Cli: () => Cli,
  default: () => cli_default
});
module.exports = __toCommonJS(cli_exports);
var import_node_child_process = require("node:child_process");
var import_node_path = __toESM(require("node:path"), 1);
class Cli {
  constructor() {
    this.cwd = process.cwd();
    this.env = {};
    this.killSignal = null;
    this.killDelay = 0;
    this.exitCode = null;
    this.stdout = "";
    this.stderr = "";
  }
  /**
   * Sets the Current Working Directory for the command.
   *
   * @param {string} cwd - The new CWD
   */
  setCwd(cwd) {
    if (cwd.indexOf("/") === 0) {
      this.cwd = cwd;
    } else {
      this.cwd = import_node_path.default.join(process.cwd(), cwd);
    }
  }
  /**
   * Returns Current Working Directory.
   *
   * @return {string}
   */
  getCwd() {
    return this.cwd;
  }
  /**
   * Defines environment variables.
   * Beware that all existing ones will be overridden!
   *
   * @param {Object} env - The environment variables object
   */
  setEnvironmentVariables(env) {
    this.env = env;
  }
  /**
   * Defines a single environment variable.
   *
   * @param {string} name  - The environment variable name
   * @param {string} value - The value associated to the variable
   */
  setEnvironmentVariable(name, value) {
    this.env[name] = value;
  }
  scheduleKillProcess(delay, signal) {
    this.killDelay = delay;
    this.killSignal = signal;
  }
  /**
   * Returns latest command execution exit code.
   *
   * @return {number} The exit code
   */
  getExitCode() {
    return this.exitCode;
  }
  /**
   * Returns captured output.
   *
   * @throws {TypeError} Argument `type` must be one of: 'stdout', 'stderr'
   * @param {string} [type=stdout] - The standard stream type
   * @returns {string} The captured output
   */
  getOutput(type = "stdout") {
    if (type === "stdout") return this.stdout;
    else if (type === "stderr") return this.stderr;
    throw new TypeError(`invalid output type '${type}', must be one of: 'stdout', 'stderr'`);
  }
  /**
   * Resets the Cli helper:
   * - CWD is reset to current process CWD
   * - environment variables
   * - killDelay & killSignal are disabled
   * - exitCode is set to null
   * - stdout is set to an empty string
   * - stderr is set to an empty string
   */
  reset() {
    this.cwd = process.cwd();
    this.env = {};
    this.killDelay = 0;
    this.killSignal = null;
    this.exitCode = null;
    this.stdout = "";
    this.stderr = "";
  }
  /**
   * Run given command.
   *
   * @param {string} rawCommand - The command string
   * @returns {Promise.<boolean>} The resulting `Promise`
   */
  run(rawCommand) {
    const [command, ...args] = rawCommand.split(" ");
    return new Promise((resolve, reject) => {
      const cmd = (0, import_node_child_process.spawn)(command, args, {
        cwd: this.cwd,
        env: { ...process.env, ...this.env }
      });
      let killer;
      let killed = false;
      if (this.killSignal !== null) {
        killer = setTimeout(() => {
          cmd.kill(this.killSignal);
          killed = true;
        }, this.killDelay);
      }
      const cmdStdout = [];
      const cmdStderr = [];
      cmd.stdout.on("data", cmdStdout.push.bind(cmdStdout));
      cmd.stderr.on("data", cmdStderr.push.bind(cmdStderr));
      cmd.on("close", (code, signal) => {
        if (killer !== void 0) {
          if (killed !== true) {
            clearTimeout(killer);
            return reject(
              new Error(
                `process.kill('${this.killSignal}') scheduled but process exited (delay: ${this.killDelay}ms)`
              )
            );
          }
        }
        this.exitCode = code;
        this.stdout = Buffer.concat(cmdStdout).toString();
        this.stderr = Buffer.concat(cmdStderr).toString();
        resolve(true);
      });
    });
  }
}
function cli_default(...args) {
  return new Cli(...args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cli
});
