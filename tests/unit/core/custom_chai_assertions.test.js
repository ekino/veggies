import * as chai from 'chai'
import { registerChaiAssertion } from '../../../src/core/custom_chai_assertions.js'
import { beforeAll, test, expect, vi } from 'vitest'

beforeAll(() => {
    chai.use(registerChaiAssertion)
})

test('registerChaiAssertion should add startWith and endWith assertion methods', () => {
    const addMethodMock = vi.fn()
    const fakeChai = {
        Assertion: {
            addMethod: addMethodMock,
        },
    }

    registerChaiAssertion(fakeChai, undefined)

    expect(addMethodMock).toHaveBeenCalledTimes(2)
    expect(addMethodMock).toHaveBeenCalledWith('startWith', expect.any(Function))
    expect(addMethodMock).toHaveBeenCalledWith('endWith', expect.any(Function))
})

test('chai startWith should pass', () => {
    expect(() => chai.expect('foo').to.startWith('fo')).not.toThrow()
})

test('chai startWith should fail', () => {
    expect(() => chai.expect('foo').to.startWith('ba')).toThrowError(
        "expected 'foo' to start with 'ba'",
    )
})

test('chai startWith should fail with a negated message', () => {
    expect(() => chai.expect('foo').not.to.startWith('fo')).toThrowError(
        "expected 'foo' not to start with 'fo'",
    )
})

test('chai endWith should pass', () => {
    expect(() => chai.expect('foo').to.endWith('oo')).not.toThrow()
})

test('chai endWith should fail', () => {
    expect(() => chai.expect('foo').to.endWith('ar')).toThrowError(
        "expected 'foo' to end with 'ar'",
    )
})

test('chai endWith should fail with a negated message', () => {
    expect(() => chai.expect('foo').not.to.endWith('oo')).toThrowError(
        "expected 'foo' not to end with 'oo'",
    )
})
