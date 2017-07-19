'use strict'

/**
 * The CLI helper used by the CLI extension.
 *
 * @module extensions/Cli/Cli
 */

const { spawn } = require('child_process')
const path = require('path')

/**
 * The Current Working Directory.
 *
 * @type {string}
 */
let cwd

/**
 * An object containing environment variables to inject when running your command.
 *
 * @type {Object}
 */
let env = {}

/** @type {string} */
let killSignal

/** @type {number} */
let killDelay

/**
 * Latest command execution exit code.
 *
 * @type {number}
 */
let exitCode

/**
 * The command's output.
 *
 * @type {string}
 */
let stdout

/**
 * The command's error output.
 *
 * @type {string}
 */
let stderr

/**
 * Sets the Current Working Directory for the command.
 *
 * @param {string} _cwd - The new CWD
 */
exports.setCwd = _cwd => {
    if (_cwd.indexOf('/') === 0) {
        cwd = _cwd
    } else {
        cwd = path.join(process.cwd(), _cwd)
    }
}

/**
 * Returns Current Working Directory.
 *
 * @return {string}
 */
exports.getCwd = () => cwd

/**
 * Defines environment variables.
 * Beware that all existing ones will be overridden!
 *
 * @param {Object} _env - The environment variables object
 */
exports.setEnvironmentVariables = _env => {
    env = _env
}

/**
 * Defines a single environment variable.
 *
 * @param {string} name  - The environment variable name
 * @param {string} value - The value associated to the variable
 */
exports.setEnvironmentVariable = (name, value) => {
    env[name] = value
}

exports.scheduleKillProcess = (delay, signal) => {
    killDelay = delay
    killSignal = signal
}

/**
 * Returns latest command execution exit code.
 *
 * @return {number} The exit code
 */
exports.getExitCode = () => exitCode

/**
 * Returns captured output.
 *
 * @throws {TypeError} Argument `type` must be one of: 'stdout', 'stderr'
 * @param {string} [type=stdout] - The standard stream type
 * @returns {string} The captured output
 */
exports.getOutput = (type = 'stdout') => {
    if (type === 'stdout') return stdout
    else if (type === 'stderr') return stderr

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
exports.reset = () => {
    cwd = process.cwd()
    env = {}
    killDelay = 0
    killSignal = null
    exitCode = null
    stdout = ''
    stderr = ''
}

/**
 * Run given command.
 *
 * @param {string} rawCommand - The command string
 * @returns {Promise.<boolean>} The resulting `Promise`
 */
exports.run = rawCommand => {
    const [command, ...args] = rawCommand.split(' ')

    return new Promise((resolve, reject) => {
        // we inherit from current env vars
        // otherwise, we can have problem with PATH
        const cmd = spawn(command, args, {
            cwd,
            env: Object.assign({}, process.env, env)
        })

        let killer
        let killed = false
        if (killSignal !== null) {
            killer = setTimeout(() => {
                cmd.kill(killSignal)
                killed = true
            }, killDelay)
        }

        const cmdStdout = []
        const cmdStderr = []

        cmd.stdout.on('data', cmdStdout.push.bind(cmdStdout))
        cmd.stderr.on('data', cmdStderr.push.bind(cmdStderr))

        cmd.on('close', code => {
            if (killer !== undefined) {
                if (killed !== true) {
                    clearTimeout(killer)

                    return reject(
                        new Error(
                            `process.kill('${killSignal}') scheduled but process exited (delay: ${killDelay}ms)`
                        )
                    )
                }
            }

            exitCode = code

            stdout = Buffer.concat(cmdStdout).toString()
            stderr = Buffer.concat(cmdStderr).toString()

            resolve(true)
        })
    })
}
