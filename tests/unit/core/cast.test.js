import * as Cast from '../../../src/core/cast.js'
import { test, expect } from 'vitest'

test('cast nulls', () => {
    expect(Cast.getCastedValue('((null))')).toBe(null)
})

test('cast undefined', () => {
    expect(Cast.getCastedValue('((undefined))')).toBe(undefined)
})

test('cast numbers', () => {
    expect(Cast.getCastedValue('1((number))')).toBe(1)
    expect(Cast.getCastedValue('.2((number))')).toBe(0.2)
    expect(Cast.getCastedValue('-3((number))')).toBe(-3)
})

test('cast dates', () => {
    expect(Cast.getCastedValue('today((date))')).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
    expect(Cast.getCastedValue('2010-10-10((date))')).toBe('2010-10-10T00:00:00.000Z')
})

test('throw when trying to cast invalid numbers', () => {
    expect(() => {
        Cast.getCastedValue('nan((number))')
    }).toThrow(`Unable to cast value to number 'nan'`)
})

test('cast booleans', () => {
    expect(Cast.getCastedValue('true((boolean))')).toBe(true)
    expect(Cast.getCastedValue('false((boolean))')).toBe(false)
})

test('cast arrays', () => {
    expect(Cast.getCastedValue('((array))')).toEqual([])
    expect(Cast.getCastedValue('one((array))')).toEqual(['one'])
    expect(Cast.getCastedValue('one,2((number)),true((boolean))((array))')).toEqual([
        'one',
        2,
        true,
    ])
})

test('cast strings', () => {
    expect(Cast.getCastedValue('yay((string))')).toEqual('yay')
})

test('left value untouched if no casting directive were found', () => {
    expect(Cast.getCastedValue('untouched')).toBe('untouched')
})

test('throw when type is invalid', () => {
    expect(() => {
        Cast.getCastedValue('test((invalid))')
    }).toThrow(`Invalid type provided: invalid 'test((invalid))'`)
})

test('cast array of values', () => {
    expect(Cast.getCastedArray(['1((number))', 'true((boolean))', 'a,b,c((array))'])).toEqual([
        1,
        true,
        ['a', 'b', 'c'],
    ])
})

test('cast array of objects', () => {
    expect(
        Cast.getCastedObjects([
            { a: '1((number))' },
            { b: 'true((boolean))' },
            { c: 'a,b,c((array))' },
        ]),
    ).toEqual([{ a: 1 }, { b: true }, { c: ['a', 'b', 'c'] }])
})

test('Add a new type to cast', () => {
    Cast.addType('newType', (value) => value === 'true')
    expect(Cast.getCastedValue('test((newType))')).toEqual(false)
})

test('throw when trying to add a type without providing a casting function', () => {
    expect(() => {
        Cast.addType('newType2', 'test')
    }).toThrow('Invalid cast function provided, must be a function')

    expect(() => {
        Cast.getCastedValue('test((newType2))')
    }).toThrow(`Invalid type provided: newType2 'test((newType2))'`)
})
