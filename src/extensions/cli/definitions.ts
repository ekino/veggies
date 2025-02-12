import { Given, Then, When, world } from '@cucumber/cucumber'
import { expect } from 'chai'

export const install = () => {
    Given(/^(?:I )?set (?:working directory|cwd) to (.+)$/, (cwd) => {
        world.cli.setCwd(cwd)
    })

    Given(/^(?:I )?set ([^ ]+) (?:env|environment) (?:var|variable) to (.+)$/, (name, value) => {
        world.cli.setEnvironmentVariable(name, value)
    })

    Given(/^(?:I )?set (?:env|environment) (?:vars|variables)$/, (step) => {
        world.cli.setEnvironmentVariables(step.rowsHash())
    })

    Given(/^(?:I )?kill the process with ([^ ]+) in (\d+)(ms|s)/, (signal, _delay, unit) => {
        let delay = Number(_delay)
        if (unit === 's') {
            delay = delay * 1000
        }

        world.cli.scheduleKillProcess(delay, signal)
    })

    When(/^(?:I )?run command (.+)$/, (command) => {
        return world.cli.run(command)
    })

    When(/^(?:I )?dump (stderr|stdout)$/, (type) => {
        const output = world.cli.getOutput(type)
        console.log(output)
    })

    Then(/^(?:the )?(?:command )?exit code should be (\d+)$/, (expectedExitCode) => {
        const exitCode = world.cli.getExitCode()

        expect(
            exitCode,
            `The command exit code doesn't match expected ${expectedExitCode}, found: ${exitCode}`,
        ).to.equal(Number(expectedExitCode))
    })

    Then(/^(stderr|stdout) should be empty$/, (type) => {
        const output = world.cli.getOutput(type)

        expect(output).to.be.empty
    })

    Then(/^(stderr|stdout) should contain (.+)$/, (type, expected) => {
        const output = world.cli.getOutput(type)

        expect(output).to.contain(expected)
    })

    Then(/^(stderr|stdout) should not contain (.+)$/, (type, expected) => {
        const output = world.cli.getOutput(type)

        expect(output).to.not.contain(expected)
    })

    Then(/^(stderr|stdout) should match (.+)$/, (type, regex) => {
        const output = world.cli.getOutput(type)

        expect(output).to.match(new RegExp(regex, 'gim'))
    })

    Then(/^(stderr|stdout) should not match (.+)$/, (type, regex) => {
        const output = world.cli.getOutput(type)

        expect(output).to.not.match(new RegExp(regex, 'gim'))
    })
}
