'use strict'

import { jest } from '@jest/globals'
import sinon from 'sinon'
import * as helper from '../definitions_helper.js'
import * as definitions from '../../../src/extensions/cli/definitions.js'

beforeEach(() => {
    definitions.install()
})

afterEach(() => {
    helper.clearContext()
})

test('set current working directory', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('set (?:working directory|cwd) to')
    def.shouldNotMatch('I set working directory to ')
    def.shouldMatch('I set working directory to path', ['path'])
    def.shouldMatch('I set cwd to path', ['path'])
    def.shouldMatch('set working directory to path', ['path'])
    def.shouldMatch('set cwd to path', ['path'])

    const cliMock = { cli: { setCwd: jest.fn() } }
    def.exec(cliMock, 'path')
    expect(cliMock.cli.setCwd).toHaveBeenCalledWith('path')
})

test('set environment variables', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('set (?:env|environment) (?:vars|variables)')
    def.shouldMatch('I set environment variables')
    def.shouldMatch('I set environment vars')
    def.shouldMatch('I set env variables')
    def.shouldMatch('I set env vars')
    def.shouldMatch('set environment variables')
    def.shouldMatch('set environment vars')
    def.shouldMatch('set env variables')
    def.shouldMatch('set env vars')

    const cliMock = { cli: { setEnvironmentVariables: jest.fn() } }
    const envVars = { TEST_MODE: true }
    def.exec(cliMock, { rowsHash: () => envVars })
    expect(cliMock.cli.setEnvironmentVariables).toHaveBeenCalledWith(envVars)
})

test('set a single environment variable', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(?:env|environment) (?:var|variable)')
    def.shouldNotMatch('I set Accept env var to ')
    def.shouldNotMatch('I set X User Id env var to 1')
    def.shouldMatch('I set Accept environment variable to application/json')
    def.shouldMatch('I set Accept environment var to application/json')
    def.shouldMatch('I set Accept env variable to application/json')
    def.shouldMatch('I set Accept env var to application/json')
    def.shouldMatch('set Accept environment variable to application/json')
    def.shouldMatch('set Accept environment var to application/json')
    def.shouldMatch('set Accept env variable to application/json')
    def.shouldMatch('set Accept env var to application/json')

    const cliMock = { cli: { setEnvironmentVariable: jest.fn() } }
    def.exec(cliMock, 'Accept', 'application/json')
    expect(cliMock.cli.setEnvironmentVariable).toHaveBeenCalledWith('Accept', 'application/json')
})

test('schedule process killing', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('kill the process with')
    def.shouldNotMatch('I kill the process with sig in ')
    def.shouldNotMatch('I kill the process with sig in 1mn')
    def.shouldNotMatch('I kill the process with sig in xs')
    def.shouldMatch('I kill the process with sig in 1s', ['sig', '1', 's'])
    def.shouldMatch('I kill the process with sig in 10ms', ['sig', '10', 'ms'])
    def.shouldMatch('kill the process with sig in 1s', ['sig', '1', 's'])
    def.shouldMatch('kill the process with sig in 10ms', ['sig', '10', 'ms'])

    const cliMock = { cli: { scheduleKillProcess: jest.fn() } }
    def.exec(cliMock, 'sig', '10', 'ms')
    expect(cliMock.cli.scheduleKillProcess).toHaveBeenCalledWith(10, 'sig')
    def.exec(cliMock, 'sig', '10', 's')
    expect(cliMock.cli.scheduleKillProcess).toHaveBeenCalledWith(10000, 'sig')
})

test('run a command', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('run command')
    def.shouldNotMatch('I run command ')
    def.shouldMatch('I run command ls -al', ['ls -al'])
    def.shouldMatch('run command ls -al', ['ls -al'])

    const cliMock = { cli: { run: jest.fn(() => Promise.resolve()) } }
    def.exec(cliMock, 'ls -al')
    expect(cliMock.cli.run).toHaveBeenCalledWith('ls -al')
})

test('dump stdout or stderr for debugging purpose', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('dump (stderr|stdout)')
    def.shouldNotMatch('I dump stdcrap')
    def.shouldMatch('I dump stdout', ['stdout'])
    def.shouldMatch('I dump stderr', ['stderr'])
    def.shouldMatch('dump stdout', ['stdout'])
    def.shouldMatch('dump stderr', ['stderr'])

    const cliMock = { cli: { getOutput: jest.fn() } }
    def.exec(cliMock, 'stdout')
    expect(cliMock.cli.getOutput).toHaveBeenCalledWith('stdout')
})

test('check exit code', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(?:command )?exit code should be')
    def.shouldNotMatch('the command exit code should be ')
    def.shouldNotMatch('the command exit code should be nan')
    def.shouldMatch('the command exit code should be 1', ['1'])
    def.shouldMatch('command exit code should be 0', ['0'])
    def.shouldMatch('exit code should be 32', ['32'])

    const cliMock = { cli: { getExitCode: jest.fn(() => 1) } }
    expect(() => {
        def.exec(cliMock, '0')
    }).toThrow('0', `The command exit code doesn't match expected 0, found: 0`)

    expect(cliMock.cli.getExitCode).toHaveBeenCalled()
})

test('check if stdout or stderr is empty', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should be empty')
    def.shouldNotMatch('stdcrap should be empty')
    def.shouldMatch('stdout should be empty', ['stdout'])
    def.shouldMatch('stderr should be empty', ['stderr'])

    const getOutput = sinon.stub()
    getOutput.withArgs('stdout').returns('not empty stdout')
    getOutput.withArgs('stdout').onSecondCall().returns('')
    getOutput.withArgs('stderr').returns('not empty stderr')
    getOutput.withArgs('stderr').onSecondCall().returns('')

    const cliMock = { cli: { getOutput: getOutput } }

    expect(() => {
        def.exec(cliMock, 'stdout')
    }).toThrow("expected 'not empty stdout' to be empty")
    expect(() => {
        def.exec(cliMock, 'stdout')
    }).not.toThrow()

    expect(() => {
        def.exec(cliMock, 'stderr')
    }).toThrow("expected 'not empty stderr' to be empty")
    expect(() => {
        def.exec(cliMock, 'stderr')
    }).not.toThrow()
})

test('check if stdout or stderr contains something', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should contain')
    def.shouldNotMatch('stdcrap should contain something')
    def.shouldNotMatch('stdout should contain ')
    def.shouldMatch('stdout should contain something', ['stdout', 'something'])
    def.shouldMatch('stderr should contain something', ['stderr', 'something'])

    const getOutput = sinon.stub()
    getOutput.withArgs('stdout').returns('nothing on stdout')
    getOutput.withArgs('stdout').onSecondCall().returns('something on stdout')
    getOutput.withArgs('stderr').returns('nothing on stderr')
    getOutput.withArgs('stderr').onSecondCall().returns('something on stderr')
    const cliMock = { cli: { getOutput: getOutput } }

    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).toThrow(`expected 'nothing on stdout' to include 'something'`)
    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).not.toThrow()

    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).toThrow(`expected 'nothing on stderr' to include 'something'`)
    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).not.toThrow()
})

test('check if stdout or stderr does not contain something', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should not contain')
    def.shouldNotMatch('stdcrap should not contain something')
    def.shouldNotMatch('stdout should not contain ')
    def.shouldMatch('stdout should not contain something', ['stdout', 'something'])
    def.shouldMatch('stderr should not contain something', ['stderr', 'something'])

    const getOutput = sinon.stub()
    getOutput.withArgs('stdout').returns('something on stdout')
    getOutput.withArgs('stdout').onSecondCall().returns('nothing on stdout')
    getOutput.withArgs('stderr').returns('something on stderr')
    getOutput.withArgs('stderr').onSecondCall().returns('nothing on stderr')
    const cliMock = { cli: { getOutput: getOutput } }

    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).toThrow(`expected 'something on stdout' to not include 'something'`)
    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).not.toThrow()

    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).toThrow(`expected 'something on stderr' to not include 'something'`)
    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).not.toThrow()
})

test('check if stdout or stderr matches a regular expression', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should match')
    def.shouldNotMatch('stdcrap should match something')
    def.shouldNotMatch('stdout should match ')
    def.shouldMatch('stdout should match regex', ['stdout', 'regex'])
    def.shouldMatch('stderr should match regex', ['stderr', 'regex'])

    const getOutput = sinon.stub()
    getOutput.withArgs('stdout').returns('nothing on stdout')
    getOutput.withArgs('stdout').onSecondCall().returns('something on stdout')
    getOutput.withArgs('stderr').returns('nothing on stderr')
    getOutput.withArgs('stderr').onSecondCall().returns('something on stderr')
    const cliMock = { cli: { getOutput: getOutput } }

    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).toThrow(`expected 'nothing on stdout' to match /something/gim`)
    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).not.toThrow()

    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).toThrow(`expected 'nothing on stderr' to match /something/gim`)
    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).not.toThrow()
})

test('check if stdout or stderr does not match a regular expression', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should not match')
    def.shouldNotMatch('stdcrap should not match regex')
    def.shouldNotMatch('stdout should not match ')
    def.shouldMatch('stdout should not match regex', ['stdout', 'regex'])
    def.shouldMatch('stderr should not match regex', ['stderr', 'regex'])

    const getOutput = sinon.stub()
    getOutput.withArgs('stdout').returns('something on stdout')
    getOutput.withArgs('stdout').onSecondCall().returns('nothing on stdout')
    getOutput.withArgs('stderr').returns('something on stderr')
    getOutput.withArgs('stderr').onSecondCall().returns('nothing on stderr')
    const cliMock = { cli: { getOutput: getOutput } }

    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).toThrow(`expected 'something on stdout' not to match /something/gim`)
    expect(() => {
        def.exec(cliMock, 'stdout', 'something')
    }).not.toThrow()

    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).toThrow(`expected 'something on stderr' not to match /something/gim`)
    expect(() => {
        def.exec(cliMock, 'stderr', 'something')
    }).not.toThrow()
})
