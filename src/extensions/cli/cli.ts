import { spawn } from 'node:child_process'
import path from 'node:path'

export type CliArgs = ConstructorParameters<typeof Cli>

class Cli {
    public cwd: string
    public env: Record<string, string>
    public killSignal: number | NodeJS.Signals | undefined
    public killDelay: number
    public exitCode: number | undefined
    public stdout: string
    public stderr: string

    constructor() {
        this.cwd = process.cwd()
        this.env = {}
        this.killSignal = undefined
        this.killDelay = 0
        this.exitCode = undefined
        this.stdout = ''
        this.stderr = ''
    }

    /**
     * Sets the Current Working Directory for the command.
     */
    setCwd(cwd: string): void {
        if (cwd.indexOf('/') === 0) {
            this.cwd = cwd
        } else {
            this.cwd = path.join(process.cwd(), cwd)
        }
    }

    /**
     * Returns Current Working Directory.
     */
    getCwd(): string {
        return this.cwd
    }

    /**
     * Defines environment variables.
     * Beware that all existing ones will be overridden!
     */
    setEnvironmentVariables(env: Record<string, string>): void {
        this.env = env
    }

    /**
     * Defines a single environment variable.
     */
    setEnvironmentVariable(name: string, value: string): void {
        this.env[name] = value
    }

    scheduleKillProcess(delay: number, signal: number | NodeJS.Signals): void {
        this.killDelay = delay
        this.killSignal = signal
    }

    /**
     * Returns latest command execution exit code.
     */
    getExitCode(): number | undefined {
        return this.exitCode
    }

    /**
     * Returns captured output.
     */
    getOutput(type = 'stdout'): string {
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
        this.killSignal = undefined
        this.exitCode = undefined
        this.stdout = ''
        this.stderr = ''
    }

    /**
     * Run given command.
     */
    run(rawCommand: string): Promise<void> {
        const [command, ...args] = rawCommand.split(' ')

        return new Promise((resolve, reject) => {
            if (!command) return reject()
            // we inherit from current env vars
            // otherwise, we can have problem with PATH
            const cmd = spawn(command, args, {
                cwd: this.cwd,
                env: { ...process.env, ...this.env },
            })

            let killer: NodeJS.Timeout | undefined
            let killed = false
            if (this.killSignal != undefined) {
                killer = setTimeout(() => {
                    cmd.kill(this.killSignal ?? undefined)
                    killed = true
                }, this.killDelay)
            }

            const cmdStdout: Uint8Array[] = []
            const cmdStderr: Uint8Array[] = []

            cmd.stdout.on('data', cmdStdout.push.bind(cmdStdout))
            cmd.stderr.on('data', cmdStderr.push.bind(cmdStderr))

            cmd.on('close', (code, _signal) => {
                if (killer !== undefined) {
                    if (killed !== true) {
                        clearTimeout(killer)

                        return reject(
                            new Error(
                                `process.kill('${this.killSignal}') scheduled but process exited (delay: ${this.killDelay}ms)`,
                            ),
                        )
                    }
                }

                this.exitCode = code ?? undefined

                this.stdout = Buffer.concat(cmdStdout).toString()
                this.stderr = Buffer.concat(cmdStderr).toString()

                resolve()
            })
        })
    }
}

/**
 * Create a new isolated Cli
 */
export default function (...args: CliArgs): Cli {
    return new Cli(...args)
}

/**
 * Cli extension.
 */
export { Cli }
