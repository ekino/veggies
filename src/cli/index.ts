import arg from 'arg'
import CucumberCli from '@cucumber/cucumber/lib/cli/index'

const veggiesArgsDefinitions = {
    '--cleanSnapshots': Boolean,
    '--updateSnapshots': Boolean,
    '-u': '--updateSnapshots',
    '--preventSnapshotsCreation': Boolean,
}

/* eslint-disable no-console */
export const printHelp = (): void => {
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

export const run = async (argv: string[]): Promise<void> => {
    const { _: cucumberArgs } = arg(veggiesArgsDefinitions, {
        argv,
        permissive: true,
    })

    try {
        if (cucumberArgs.includes('--help')) {
            printHelp()
        }

        const result = await new CucumberCli({
            argv: cucumberArgs,
            cwd: process.cwd(),
            stdout: process.stdout,
        }).run()

        process.exit(result.success ? 0 : 1)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}
/* eslint-enable no-console */
