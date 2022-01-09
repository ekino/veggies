import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { expect } from 'chai'
import { cli } from './'

export const install = (): void => {
    Given(/^(?:I )?set (?:working directory|cwd) to (.+)$/, function (cwd: string) {
        cli.setCwd(cwd)
    })

    Given(
        /^(?:I )?set ([^ ]+) (?:env|environment) (?:var|variable) to (.+)$/,
        function (name: string, value: string) {
            cli.setEnvironmentVariable(name, value)
        }
    )

    Given(/^(?:I )?set (?:env|environment) (?:vars|variables)$/, function (step: DataTable) {
        cli.setEnvironmentVariables(step.rowsHash())
    })

    Given(
        /^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/,
        function (signal: number | NodeJS.Signals, _delay: number, unit: string) {
            let delay = Number(_delay)
            if (unit === 's') {
                delay = delay * 1000
            }

            cli.scheduleKillProcess(delay, signal)
        }
    )

    When(/^(?:I )?run command (.+)$/, function (command: string) {
        return cli.run(command)
    })

    When(/^(?:I )?dump (stderr|stdout)$/, function (type: string) {
        const output = cli.getOutput(type)
        console.log(output) // eslint-disable-line no-console
    })

    Then(
        /^(?:the )?(?:command )?exit code should be (\d+)$/,
        function (expectedExitCode: string | number) {
            const exitCode = cli.getExitCode() ?? -1

            expect(
                exitCode,
                `The command exit code doesn't match expected ${expectedExitCode}, found: ${exitCode}`
            ).to.equal(Number(expectedExitCode))
        }
    )

    Then(/^(stderr|stdout) should be empty$/, function (type: string) {
        const output = cli.getOutput(type)

        expect(output).to.be.empty
    })

    Then(/^(stderr|stdout) should contain (.+)$/, function (type: string, expected: string) {
        const output = cli.getOutput(type)

        expect(output).to.contain(expected)
    })

    Then(/^(stderr|stdout) should not contain (.+)$/, function (type: string, expected: string) {
        const output = cli.getOutput(type)

        expect(output).to.not.contain(expected)
    })

    Then(/^(stderr|stdout) should match (.+)$/, function (type: string, regex: RegExp | string) {
        const output = cli.getOutput(type)

        expect(output).to.match(new RegExp(regex, 'gim'))
    })

    Then(
        /^(stderr|stdout) should not match (.+)$/,
        function (type: string, regex: RegExp | string) {
            const output = cli.getOutput(type)

            expect(output).to.not.match(new RegExp(regex, 'gim'))
        }
    )
}
