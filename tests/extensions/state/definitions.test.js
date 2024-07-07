'use strict'

import { jest } from '@jest/globals'
import * as helper from '../definitions_helper.js'
import * as definitions from '../../../src/extensions/state/definitions.js'

beforeEach(() => {
    definitions.install()
})

afterEach(() => {
    helper.clearContext()
})

test('set state property', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('set state (.+) to')
    def.shouldNotMatch('I set state property to ')
    def.shouldMatch('I set state property to value', ['property', 'value'])
    def.shouldMatch('set state property to value', ['property', 'value'])

    const stateMock = { state: { set: jest.fn() } }
    def.exec(stateMock, 'property', 'value')
    expect(stateMock.state.set).toHaveBeenCalledWith('property', 'value')
})

test('clear state', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('clear state')
    def.shouldMatch('I clear state')
    def.shouldMatch('clear state')

    const stateMock = { state: { clear: jest.fn() } }
    def.exec(stateMock)
    expect(stateMock.state.clear).toHaveBeenCalled()
})

test('dump current state', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('dump state')
    def.shouldMatch('I dump state')
    def.shouldMatch('dump state')

    const stateMock = { state: { dump: jest.fn(() => 'state') } }
    def.exec(stateMock)
    expect(stateMock.state.dump).toHaveBeenCalled()
})
