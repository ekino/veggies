'use strict'

jest.mock('../../node_modules/chai/lib/chai/config', () => ({
    useProxy: false
}))

const chai = jest.genMockFromModule('chai')

const equal = jest.fn()
const contain = jest.fn()
const match = jest.fn()

const chainable = {
    equal,
    contain,
    match
}

chainable.to = chainable
chainable.be = chainable
chainable.not = chainable
chainable.empty = chainable

const expect = jest.fn(() => chainable)

exports.expect = expect
exports.equal = equal
exports.contain = contain
exports.match = match

exports.clear = () => {
    expect.mockClear()
    equal.mockClear()
    contain.mockClear()
    match.mockClear()
}
