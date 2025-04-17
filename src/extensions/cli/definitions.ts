import * as assert from 'node:assert/strict'
import { type DataTable, Given, Then, When, world } from '@cucumber/cucumber'

export const install = (): void => {
    Given(/^(?:I )?set (?:working directory|cwd) to (.+)$/, (cwd: string): void => {
        world.cli.setCwd(cwd)
    })

    Given(
        /^(?:I )?set ([^ ]+) (?:env|environment) (?:var|variable) to (.+)$/,
        (name: string, value: string): void => {
            world.cli.setEnvironmentVariable(name, value)
        }
    )

    Given(/^(?:I )?set (?:env|environment) (?:vars|variables)$/, (step: DataTable): void => {
        world.cli.setEnvironmentVariables(step.rowsHash())
    })

    Given(
        /^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/,
        (signal: number | NodeJS.Signals, _delay: number, unit: string): void => {
            let delay = Number(_delay)
            if (unit === 's') {
                delay = delay * 1000
            }

            world.cli.scheduleKillProcess(delay, signal)
        }
    )

    When(/^(?:I )?run command (.+)$/, async (command: string): Promise<void> => {
        return world.cli.run(command)
    })

    When(/^(?:I )?dump (stderr|stdout)$/, (type: string): void => {
        const output = world.cli.getOutput(type)
        console.log(output)
    })

    Then(
        /^(?:the )?(?:command )?exit code should be (\d+)$/,
        (expectedExitCode: string | number): void => {
            const exitCode = world.cli.getExitCode()
            const message = `The command exit code doesn't match expected ${expectedExitCode}, found: ${exitCode}`
            assert.strictEqual(exitCode, Number(expectedExitCode), message)
        }
    )

    Then(/^(stderr|stdout) should be empty$/, (type: string): void => {
        const output = world.cli.getOutput(type)
        assert.strictEqual(output, '', `Expected ${type} to be empty, but got: "${output}"`)
    })

    Then(/^(stderr|stdout) should contain (.+)$/, (type: string, expected: string): void => {
        const output = world.cli.getOutput(type)
        assert.ok(
            output.includes(expected),
            `Expected ${type} to contain "${expected}", but got: "${output}"`
        )
    })

    Then(/^(stderr|stdout) should not contain (.+)$/, (type: string, expected: string): void => {
        const output = world.cli.getOutput(type)
        assert.ok(
            !output.includes(expected),
            `Expected ${type} not to contain "${expected}", but got: "${output}"`
        )
    })

    Then(/^(stderr|stdout) should match (.+)$/, (type: string, regex: string | RegExp): void => {
        const output = world.cli.getOutput(type)
        const re = regex instanceof RegExp ? regex : new RegExp(regex, 'gim')
        assert.match(output, re, `Expected ${type} to match ${re}, but got: "${output}"`)
    })

    Then(
        /^(stderr|stdout) should not match (.+)$/,
        (type: string, regex: string | RegExp): void => {
            const output = world.cli.getOutput(type)
            const re = regex instanceof RegExp ? regex : new RegExp(regex, 'gim')
            assert.doesNotMatch(
                output,
                re,
                `Expected ${type} not to match ${re}, but got: "${output}"`
            )
        }
    )
}
