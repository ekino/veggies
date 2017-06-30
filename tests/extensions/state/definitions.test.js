'use strict'

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/state/definitions')

test('should allow to set a state property', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set state (.+) to')
    def.shouldHaveType('Given')
    def.shouldNotMatch('I set state property to ')
    def.shouldMatch('I set state property to value', ['property', 'value'])
    def.shouldMatch('set state property to value', ['property', 'value'])

    const stateMock = { state: { set: jest.fn() } }
    def.exec(stateMock, 'property', 'value')
    expect(stateMock.state.set).toHaveBeenCalledWith('property', 'value')
})

test('should allow to clear state', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('clear state')
    def.shouldHaveType('When')
    def.shouldMatch('I clear state')
    def.shouldMatch('clear state')

    const stateMock = { state: { clear: jest.fn() } }
    def.exec(stateMock)
    expect(stateMock.state.clear).toHaveBeenCalled()
})

test('should allow to dump current state', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('dump state')
    def.shouldHaveType('When')
    def.shouldMatch('I dump state')
    def.shouldMatch('dump state')

    const stateMock = { state: { dump: jest.fn(() => 'state') } }
    def.exec(stateMock)
    expect(stateMock.state.dump).toHaveBeenCalled()
})
