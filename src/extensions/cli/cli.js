'use strict'

/**
 * The CLI helper used by the CLI extension.
 *
 * @module extensions/Cli/Cli
 */

const { spawn } = require('child_process')
const path = require('path')

/**
 * Cli extension.
 *
 * @class
 */
class Cli {
    constructor() {
        /**
         * The Current Working Directory.
         *
         * @type {string}
         */
        this.cwd = process.cwd()

        /**
         * An object containing environment variables to inject when running your command.
         *
         * @type {Object}
         */
        this.env = {}

        /** @type {string} */
        this.killSignal = null

        /** @type {number} */
        this.killDelay = 0

        /**
         * Latest command execution exit code.
         *
         * @type {number}
         */
        this.exitCode = null

        /**
         * The command's output.
         *
         * @type {string}
         */
        this.stdout = ''

        /**
         * The command's error output.
         *
         * @type {string}
         */
        this.stderr = ''
    }

    /**
     * Sets the Current Working Directory for the command.
     *
     * @param {string} cwd - The new CWD
     */
    setCwd(cwd) {
        if (cwd.indexOf('/') === 0) {
            this.cwd = cwd
        } else {
            this.cwd = path.join(process.cwd(), cwd)
        }
    }

    /**
     * Returns Current Working Directory.
     *
     * @return {string}
     */
    getCwd() {
        return this.cwd
    }

    /**
     * Defines environment variables.
     * Beware that all existing ones will be overridden!
     *
     * @param {Object} env - The environment variables object
     */
    setEnvironmentVariables(env) {
        this.env = env
    }

    /**
     * Defines a single environment variable.
     *
     * @param {string} name  - The environment variable name
     * @param {string} value - The value associated to the variable
     */
    setEnvironmentVariable(name, value) {
        this.env[name] = value
    }

    scheduleKillProcess(delay, signal) {
        this.killDelay = delay
        this.killSignal = signal
    }

    /**
     * Returns latest command execution exit code.
     *
     * @return {number} The exit code
     */
    getExitCode() {
        return this.exitCode
    }

    /**
     * Returns captured output.
     *
     * @throws {TypeError} Argument `type` must be one of: 'stdout', 'stderr'
     * @param {string} [type=stdout] - The standard stream type
     * @returns {string} The captured output
     */
    getOutput(type = 'stdout') {
        if (type === 'stdout') return this.stdout
        else if (type === 'stderr') return this.stderr

        throw new TypeError(`invalid output type '${type}', must be one of: 'stdout', 'stderr'`)
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
        this.cwd = process.cwd()
        this.env = {}
        this.killDelay = 0
        this.killSignal = null
        this.exitCode = null
        this.stdout = ''
        this.stderr = ''
    }

    /**
     * Run given command.
     *
     * @param {string} rawCommand - The command string
     * @returns {Promise.<boolean>} The resulting `Promise`
     */
    run(rawCommand) {
        const [command, ...args] = rawCommand.split(' ')

        return new Promise((resolve, reject) => {
            // we inherit from current env vars
            // otherwise, we can have problem with PATH
            const cmd = spawn(command, args, {
                cwd: this.cwd,
                env: Object.assign({}, process.env, this.env)
            })

            let killer
            let killed = false
            if (this.killSignal !== null) {
                killer = setTimeout(() => {
                    cmd.kill(this.killSignal)
                    killed = true
                }, this.killDelay)
            }

            const cmdStdout = []
            const cmdStderr = []

            cmd.stdout.on('data', cmdStdout.push.bind(cmdStdout))
            cmd.stderr.on('data', cmdStderr.push.bind(cmdStderr))

            cmd.on('close', (code, signal) => {
                if (killer !== undefined) {
                    if (killed !== true) {
                        clearTimeout(killer)

                        return reject(
                            new Error(
                                `process.kill('${
                                    this.killSignal
                                }') scheduled but process exited (delay: ${this.killDelay}ms)`
                            )
                        )
                    }
                }

                this.exitCode = code

                this.stdout = Buffer.concat(cmdStdout).toString()
                this.stderr = Buffer.concat(cmdStderr).toString()

                resolve(true)
            })
        })
    }
}

/**
 * Create a new isolated Cli
 * @return {Cli}
 */
module.exports = function(...args) {
    return new Cli(...args)
}

/**
 * Cli extension.
 * @type {Cli}
 */
module.exports.Cli = Cli
