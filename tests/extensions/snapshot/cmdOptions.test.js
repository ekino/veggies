'use strict'

beforeEach(() => {
    delete require.cache[require.resolve('../../../src/extensions/snapshot/cmdOptions')]
    jest.resetModules()
})

test('Snapshot cmdOptions updateSnapshots and cleanSnapshots set to false if no args passed', () => {
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeFalsy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions updateSnapshots set to true if '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '-u']
    const cmdOptionss = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptionss.updateSnapshots).toBeTruthy()
    expect(cmdOptionss.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions updateSnapshots set to true if '--updateSnapshots' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--updateSnapshots']
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions updateSnapshots set to true if '--updateSnapshots' and '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--updateSnapshots', '-u']
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions cleanSnapshots set to true if '--cleanSnapshots' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots']
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeFalsy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})

test("Snapshot cmdOptions updateSnapshots and cleanSnapshots set to true if '--cleanSnapshots' and '--updateSnapshots' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots', '--updateSnapshots']
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})

test("Snapshot cmdOptions updateSnapshots and cleanSnapshots set to true if '--cleanSnapshots' and '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots', '-u']
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})

test("Snapshot cmdOptions updateSnapshots and cleanSnapshots set to true if '--cleanSnapshots', 'updateSnapshots' and '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots', '--updateSnapshots', '-u']
    const cmdOptions = require('../../../src/extensions/snapshot/cmdOptions')

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})
