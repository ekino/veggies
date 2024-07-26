'use strict'

import { jest } from '@jest/globals'
import * as cmdOptions from '../../../src/extensions/snapshot/cmdOptions.js'

beforeEach(() => {
    jest.resetModules()
})

test('Snapshot cmdOptions updateSnapshots and cleanSnapshots set to false if no args passed', () => {
    expect(cmdOptions.updateSnapshots).toBeFalsy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions updateSnapshots set to true if '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '-u']

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions updateSnapshots set to true if '--updateSnapshots' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--updateSnapshots']

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions updateSnapshots set to true if '--updateSnapshots' and '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--updateSnapshots', '-u']

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeFalsy()
})

test("Snapshot cmdOptions cleanSnapshots set to true if '--cleanSnapshots' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots']

    expect(cmdOptions.updateSnapshots).toBeFalsy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})

test("Snapshot cmdOptions updateSnapshots and cleanSnapshots set to true if '--cleanSnapshots' and '--updateSnapshots' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots', '--updateSnapshots']

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})

test("Snapshot cmdOptions updateSnapshots and cleanSnapshots set to true if '--cleanSnapshots' and '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots', '-u']

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})

test("Snapshot cmdOptions updateSnapshots and cleanSnapshots set to true if '--cleanSnapshots', 'updateSnapshots' and '-u' args passed", () => {
    process.argv = ['yarn', 'run', 'cucumber-js', '--cleanSnapshots', '--updateSnapshots', '-u']

    expect(cmdOptions.updateSnapshots).toBeTruthy()
    expect(cmdOptions.cleanSnapshots).toBeTruthy()
})
