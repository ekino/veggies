'use strict'

const Cast = require('../src/cast')

test('should cast nulls', () => {
    expect(Cast.value('((null))')).toBe(null)
})

test('should cast undefined', () => {
    expect(Cast.value('((undefined))')).toBe(undefined)
})

test('should cast numbers', () => {
    expect(Cast.value('1((number))')).toBe(1)
    expect(Cast.value('.2((number))')).toBe(0.2)
    expect(Cast.value('-3((number))')).toBe(-3)
})

test('should throw when trying to cast invalid numbers', () => {
    expect(() => {
        Cast.value('nan((number))')
    }).toThrow(`Unable to cast value to number 'nan((number))'`)
})

test('should cast booleans', () => {
    expect(Cast.value('true((boolean))')).toBe(true)
    expect(Cast.value('false((boolean))')).toBe(false)
})

test('should cast arrays', () => {
    expect(Cast.value('one((array))')).toEqual(['one'])
    expect(Cast.value('one,2((number)),true((boolean))((array))')).toEqual(['one', 2, true])
})

test('should left value untouched if no casting directive were found', () => {
    expect(Cast.value('untouched')).toBe('untouched')
})

test('should throw when type is invalid', () => {
    expect(() => {
        Cast.value('test((invalid))')
    }).toThrow(`Invalid type provided: invalid 'test((invalid))'`)
})
