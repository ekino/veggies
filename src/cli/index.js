'use strict'

const yargs = require('yargs')
const CucumberCli = require('@cucumber/cucumber/lib/cli').default

const veggiesArguments = ['cleanSnapshots', 'preventSnapshotsCreation', 'u', 'updateSnapshots']

const getValue = (value) => {
    switch (typeof value) {
        case 'string':
            return ` "${value}"`
        case 'number':
        case 'bigint':
            return ` ${value.toString(10)}`
        default:
            return undefined
    }
}

const getCucumberArgs = (argv) => {
    const { args, $0: cliName, _: nonPrefixedArgs, ...cliArgs } = argv

    return Object.entries(cliArgs).reduce(
        (allArgs, [arg, value]) => {
            if (!veggiesArguments.includes(arg)) {
                const argument = `-${arg.length > 1 ? '-' : ''}${arg}`
                if (Array.isArray(value)) {
                    value.forEach((it) => {
                        allArgs.push(argument, getValue(it))
                    })
                } else {
                    allArgs.push(argument)
                    const preparedValue = getValue(value)
                    if (preparedValue) allArgs.push(preparedValue)
                }
            }
            return allArgs
        },
        [process.argv[0], cliName, ...nonPrefixedArgs]
    )
}

yargs
    .scriptName('veggies')
    .usage('$0 [cucumber-args]')
    .command('$0 [args]', "Run 'cucumber-cli' after having removed custom options", async function (
        argv
    ) {
        const cucumberArgs = getCucumberArgs(argv.argv)

        await new CucumberCli({
            argv: cucumberArgs,
            cwd: process.cwd(),
            stdout: process.stdout,
        }).run()
    })
    .help().argv
