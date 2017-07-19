'use strict'

jest.mock('../../node_modules/chai/lib/chai/config', () => ({
    useProxy: false
}))

const chai = jest.genMockFromModule('chai')

const equal = jest.fn()
const contain = jest.fn()
const match = jest.fn()
const fail = jest.fn()

const chainable = {
    equal,
    contain,
    match,
    fail
}

chainable.to = chainable
chainable.be = chainable
chainable.not = chainable
chainable.empty = chainable
chainable.deep = chainable

const expect = jest.fn(() => chainable)
expect.fail = fail

exports.expect = expect
exports.equal = equal
exports.contain = contain
exports.match = match
exports.fail = fail

exports.clear = () => {
    expect.mockClear()
    equal.mockClear()
    contain.mockClear()
    match.mockClear()
    fail.mockClear()
}
