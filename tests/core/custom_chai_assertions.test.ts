import chai from 'chai'
import { match, SinonSpy, spy } from 'sinon'
import { registerChaiAssertion } from '../../src/core/custom_chai_assertions'

beforeAll(() => {
    chai.use(registerChaiAssertion)
})

describe('core > custom_chai_assertions', () => {
    let addMethodSpy: SinonSpy
    beforeAll(() => {
        addMethodSpy = spy(chai.Assertion, 'addMethod')
    })
    afterAll(() => addMethodSpy.restore())

    test('registerChaiAssertion should add startWith and endWith assertion methods', () => {
        registerChaiAssertion()

        expect(addMethodSpy.calledTwice).toBeTruthy()
        expect(addMethodSpy.calledWith('startWith', match.func)).toBeTruthy()
        expect(addMethodSpy.calledWith('endWith', match.func)).toBeTruthy()
    })

    test('chai startWith should pass', () => {
        expect(() => chai.expect('foo').to.startWith('fo')).not.toThrow()
    })

    test('chai startWith should fail', () => {
        expect(() => chai.expect('foo').to.startWith('ba')).toThrowError(
            "expected 'foo' to start with 'ba'"
        )
    })

    test('chai startWith should fail with a negated message', () => {
        expect(() => chai.expect('foo').not.to.startWith('fo')).toThrowError(
            "expected 'foo' not to start with 'fo'"
        )
    })

    test('chai endWith should pass', () => {
        expect(() => chai.expect('foo').to.endWith('oo')).not.toThrow()
    })

    test('chai endWith should fail', () => {
        expect(() => chai.expect('foo').to.endWith('ar')).toThrowError(
            "expected 'foo' to end with 'ar'"
        )
    })

    test('chai endWith should fail with a negated message', () => {
        expect(() => chai.expect('foo').not.to.endWith('oo')).toThrowError(
            "expected 'foo' not to end with 'oo'"
        )
    })
})
