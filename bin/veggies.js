#!/usr/bin/env node

const { parseArgs } = require('node:util')
const CucumberCli = require('@cucumber/cucumber/lib/cli/index').default

const veggiesArgsOptions = {
    cleanSnapshots: { type: 'boolean' },
    updateSnapshots: { type: 'boolean', short: 'u' },
    preventSnapshotsCreation: { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
}
const veggiesArgsDefinitions = {
    '--cleanSnapshots': Boolean,
    '--updateSnapshots': Boolean,
    '-u': '--updateSnapshots',
    '--preventSnapshotsCreation': Boolean,
}

const printHelp = () => {
    console.log('veggies help')
    console.log(`
Options:
  --cleanSnapshots            removes unused snapshots (not recommended while matching tags)
  -u, --updateSnapshots       updates current snapshots if required
  --preventSnapshotsCreation  a snapshot related step that would create one will fail instead (useful on CI environment)
  
For more details please visit https://github.com/ekino/veggies/blob/master/README.md
  `)
    console.log('cucumber-js help\n')
}

const run = async (argv) => {
    try {
        const { values } = parseArgs({
            args: argv.slice(2),
            options: veggiesArgsOptions,
            strict: false,
            allowPositionals: true,
        })

        if (values.help) printHelp()

        const result = await new CucumberCli({
            argv,
            cwd: process.cwd(),
            stdout: process.stdout,
            stderr: process.stderr,
            env: process.env,
        }).run()
        process.exit(result.success ? 0 : 1)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

run(process.argv)
