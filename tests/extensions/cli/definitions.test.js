'use strict'

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/cli/definitions')

beforeEach(() => {
    definitions.install()
    require('chai').clear()
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

    const cliMock = { cli: { getExitCode: jest.fn(() => 0) } }
    def.exec(cliMock, '0')
    expect(cliMock.cli.getExitCode).toHaveBeenCalled()
    expect(require('chai').expect).toHaveBeenCalledWith(
        0,
        `The command exit code doesn't match expected 0, found: 0`
    )
    expect(require('chai').equal).toHaveBeenCalledWith(0)
})

test('check if stdout or stderr is empty', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should be empty')
    def.shouldNotMatch('stdcrap should be empty')
    def.shouldMatch('stdout should be empty', ['stdout'])
    def.shouldMatch('stderr should be empty', ['stderr'])

    const cliMock = { cli: { getOutput: jest.fn(() => 'output') } }
    def.exec(cliMock, 'stdout')
    expect(cliMock.cli.getOutput).toHaveBeenCalledWith('stdout')
    expect(require('chai').expect).toHaveBeenCalledWith('output')
})

test('check if stdout or stderr contains something', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should contain')
    def.shouldNotMatch('stdcrap should contain something')
    def.shouldNotMatch('stdout should contain ')
    def.shouldMatch('stdout should contain something', ['stdout', 'something'])
    def.shouldMatch('stderr should contain something', ['stderr', 'something'])

    const cliMock = { cli: { getOutput: jest.fn(() => 'output') } }
    def.exec(cliMock, 'stdout', 'something')
    expect(cliMock.cli.getOutput).toHaveBeenCalledWith('stdout')
    expect(require('chai').expect).toHaveBeenCalledWith('output')
    expect(require('chai').contain).toHaveBeenCalledWith('something')
})

test('check if stdout or stderr does not contain something', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should not contain')
    def.shouldNotMatch('stdcrap should not contain something')
    def.shouldNotMatch('stdout should not contain ')
    def.shouldMatch('stdout should not contain something', ['stdout', 'something'])
    def.shouldMatch('stderr should not contain something', ['stderr', 'something'])

    const cliMock = { cli: { getOutput: jest.fn(() => 'output') } }
    def.exec(cliMock, 'stdout', 'something')
    expect(cliMock.cli.getOutput).toHaveBeenCalledWith('stdout')
    expect(require('chai').expect).toHaveBeenCalledWith('output')
    expect(require('chai').contain).toHaveBeenCalledWith('something')
})

test('check if stdout or stderr matches a regular expression', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should match')
    def.shouldNotMatch('stdcrap should match something')
    def.shouldNotMatch('stdout should match ')
    def.shouldMatch('stdout should match regex', ['stdout', 'regex'])
    def.shouldMatch('stderr should match regex', ['stderr', 'regex'])

    const cliMock = { cli: { getOutput: jest.fn(() => 'output') } }
    def.exec(cliMock, 'stdout', 'something')
    expect(cliMock.cli.getOutput).toHaveBeenCalledWith('stdout')
    expect(require('chai').expect).toHaveBeenCalledWith('output')
    expect(require('chai').match).toHaveBeenCalledWith(/something/gim)
})

test('check if stdout or stderr does not match a regular expression', () => {
    const context = helper.getContext() // Extension context
    const def = context.getDefinitionByMatcher('(stderr|stdout) should not match')
    def.shouldNotMatch('stdcrap should not match regex')
    def.shouldNotMatch('stdout should not match ')
    def.shouldMatch('stdout should not match regex', ['stdout', 'regex'])
    def.shouldMatch('stderr should not match regex', ['stderr', 'regex'])

    const cliMock = { cli: { getOutput: jest.fn(() => 'output') } }
    def.exec(cliMock, 'stdout', 'something')
    expect(cliMock.cli.getOutput).toHaveBeenCalledWith('stdout')
    expect(require('chai').expect).toHaveBeenCalledWith('output')
    expect(require('chai').match).toHaveBeenCalledWith(/something/gim)
})
