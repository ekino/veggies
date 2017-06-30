'use strict'

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/cli/definitions')

test('should allow to set current working directory', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set (?:working directory|cwd) to')
    def.shouldHaveType('Given')
    def.shouldNotMatch('I set working directory to ')
    def.shouldMatch('I set working directory to path', ['path'])
    def.shouldMatch('I set cwd to path', ['path'])
    def.shouldMatch('set working directory to path', ['path'])
    def.shouldMatch('set cwd to path', ['path'])
})

test('should allow to set environment variables', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set (?:env|environment) (?:vars|variables)')
    def.shouldHaveType('Given')
    def.shouldMatch('I set environment variables')
    def.shouldMatch('I set environment vars')
    def.shouldMatch('I set env variables')
    def.shouldMatch('I set env vars')
    def.shouldMatch('set environment variables')
    def.shouldMatch('set environment vars')
    def.shouldMatch('set env variables')
    def.shouldMatch('set env vars')
})

test('should allow to set a single environment variable', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(?:env|environment) (?:var|variable)')
    def.shouldHaveType('Given')
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
})

test('should allow to schedule process killing', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('kill the process with')
    def.shouldHaveType('Given')
    def.shouldNotMatch('I kill the process with sig in ')
    def.shouldNotMatch('I kill the process with sig in 1mn')
    def.shouldNotMatch('I kill the process with sig in xs')
    def.shouldMatch('I kill the process with sig in 1s', ['sig', '1', 's'])
    def.shouldMatch('I kill the process with sig in 10ms', ['sig', '10', 'ms'])
    def.shouldMatch('kill the process with sig in 1s', ['sig', '1', 's'])
    def.shouldMatch('kill the process with sig in 10ms', ['sig', '10', 'ms'])
})

test('should allow to run a command', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('run command')
    def.shouldHaveType('When')
    def.shouldNotMatch('I run command ')
    def.shouldMatch('I run command ls -al', ['ls -al'])
    def.shouldMatch('run command ls -al', ['ls -al'])
})

test('should allow to dump stdout & stderr for debugging purpose', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('dump (stderr|stdout)')
    def.shouldHaveType('When')
    def.shouldNotMatch('I dump stdcrap')
    def.shouldMatch('I dump stdout', ['stdout'])
    def.shouldMatch('I dump stderr', ['stderr'])
    def.shouldMatch('dump stdout', ['stdout'])
    def.shouldMatch('dump stderr', ['stderr'])
})

test('should allow to check exit code', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(?:command )?exit code should be')
    def.shouldHaveType('Then')
    def.shouldNotMatch('the command exit code should be ')
    def.shouldNotMatch('the command exit code should be nan')
    def.shouldMatch('the command exit code should be 1', ['1'])
    def.shouldMatch('command exit code should be 0', ['0'])
    def.shouldMatch('exit code should be 32', ['32'])
})

test('should allow to check if stdout or stderr is empty', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(stderr|stdout) should be empty')
    def.shouldHaveType('Then')
    def.shouldNotMatch('stdcrap should be empty')
    def.shouldMatch('stdout should be empty', ['stdout'])
    def.shouldMatch('stderr should be empty', ['stderr'])
})

test('should allow to check if stdout or stderr contains something', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(stderr|stdout) should contain')
    def.shouldHaveType('Then')
    def.shouldNotMatch('stdcrap should contain something')
    def.shouldNotMatch('stdout should contain ')
    def.shouldMatch('stdout should contain something', ['stdout', 'something'])
    def.shouldMatch('stderr should contain something', ['stderr', 'something'])
})

test('should allow to check if stdout or stderr does not contain something', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(stderr|stdout) should not contain')
    def.shouldHaveType('Then')
    def.shouldNotMatch('stdcrap should not contain something')
    def.shouldNotMatch('stdout should not contain ')
    def.shouldMatch('stdout should not contain something', ['stdout', 'something'])
    def.shouldMatch('stderr should not contain something', ['stderr', 'something'])
})

test('should allow to check if stdout or stderr matches a regular expression', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(stderr|stdout) should match')
    def.shouldHaveType('Then')
    def.shouldNotMatch('stdcrap should match something')
    def.shouldNotMatch('stdout should match ')
    def.shouldMatch('stdout should match regex', ['stdout', 'regex'])
    def.shouldMatch('stderr should match regex', ['stderr', 'regex'])
})

test('should allow to check if stdout or stderr does not match a regular expression', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('(stderr|stdout) should not match')
    def.shouldHaveType('Then')
    def.shouldNotMatch('stdcrap should not match regex')
    def.shouldNotMatch('stdout should not match ')
    def.shouldMatch('stdout should not match regex', ['stdout', 'regex'])
    def.shouldMatch('stderr should not match regex', ['stderr', 'regex'])
})
