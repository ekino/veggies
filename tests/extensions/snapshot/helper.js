const { spawn } = require('child_process')

/**
 * Run a command
 * @param {string} cwd - work directory
 * @param {object} env - env vars
 * @param {string} command - run command
 * @return {Promise<{ exitCode: number, stdout: string, stderr: string }>}
 */
exports.runCommand = ({ cwd, env, command }) => {
    const [_command, ...args] = command.split(' ')

    return new Promise((resolve, reject) => {
        const cmd = spawn(_command, args, {
            cwd: cwd,
            env: Object.assign({}, process.env, env)
        })

        const cmdStdout = []
        const cmdStderr = []

        cmd.stdout.on('data', cmdStdout.push.bind(cmdStdout))
        cmd.stderr.on('data', cmdStderr.push.bind(cmdStderr))

        cmd.on('close', (code, signal) => {
            const exitCode = code

            const stdout = Buffer.concat(cmdStdout).toString()
            const stderr = Buffer.concat(cmdStderr).toString()

            if (code !== 0) {
                const error = new Error(`
                    Process exited with code ${code}
                    Signal : ${signal}
                    Stdout : ${stdout}
                    Stderr : ${stderr}
                `)
                return reject(error)
            }

            resolve({ exitCode, stdout, stderr })
        })
    })
}
