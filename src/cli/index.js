'use strict'

import arg from 'arg'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const CucumberCli = require('@cucumber/cucumber/lib/cli/index').default

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

export const run = async (argv) => {
    const { _: cucumberArgs } = arg(veggiesArgsDefinitions, { argv, permissive: true })

    try {
        if (cucumberArgs.includes('--help')) {
            printHelp()
        }

        const result = await new CucumberCli({
            argv: cucumberArgs,
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
