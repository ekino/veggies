import * as helper from '../definitions_helper'
import { install } from '../../../src/extensions/state/definitions'
import { createSandbox, SinonStub } from 'sinon'
import { state } from '../../../src/extensions/state'

describe('extensions > state > definitions', () => {
    const sandbox = createSandbox()
    let setStateStub: SinonStub, clearStateStub: SinonStub, dumpStateStub: SinonStub

    beforeAll(() => {
        setStateStub = sandbox.stub(state, 'set')
        clearStateStub = sandbox.stub(state, 'clear')
        dumpStateStub = sandbox.stub(state, 'dump')
        sandbox.stub(console, 'log')
    })
    beforeEach(() => install())

    afterEach(() => {
        sandbox.reset()
        helper.clearContext()
    })
    afterAll(() => sandbox.restore())

    test('set state property', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('set state (.+) to (.+)')
        def.shouldNotMatch('I set state property to ')
        def.shouldMatch('I set state property to value', ['property', 'value'])
        def.shouldMatch('set state property to value', ['property', 'value'])

        const stateMock = { state: { set: setStateStub } }
        def.exec(stateMock, 'property', 'value')
        expect(stateMock.state.set.calledWithExactly('property', 'value')).toBeTruthy()
    })

    test('clear state', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('clear state')
        def.shouldMatch('I clear state')
        def.shouldMatch('clear state')

        const stateMock = { state: { clear: clearStateStub } }
        def.exec(stateMock)
        expect(stateMock.state.clear.calledOnce).toBeTruthy()
    })

    test('dump current state', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('dump state')
        def.shouldMatch('I dump state')
        def.shouldMatch('dump state')

        const stateMock = { state: { dump: dumpStateStub } }
        dumpStateStub.returns('state')
        def.exec(stateMock)
        expect(stateMock.state.dump.calledOnce).toBeTruthy()
    })
})
