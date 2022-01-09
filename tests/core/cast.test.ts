import * as Cast from '../../src/core/cast'
import { CastFunction, CastType } from '../../src/core/core_types'

describe('core > cast', () => {
    test('cast nulls', () => {
        expect(Cast.value('((null))')).toBe(null)
    })

    test('cast undefined', () => {
        expect(Cast.value('((undefined))')).toBe(undefined)
    })

    test('cast numbers', () => {
        expect(Cast.value('1((number))')).toBe(1)
        expect(Cast.value('.2((number))')).toBe(0.2)
        expect(Cast.value('-3((number))')).toBe(-3)
    })

    test('cast dates', () => {
        expect(Cast.value('today((date))')).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
        expect(Cast.value('2010-10-10((date))')).toBe('2010-10-10T00:00:00.000Z')
    })

    test('throw when trying to cast invalid numbers', () => {
        expect(() => {
            Cast.value('nan((number))')
        }).toThrow(`Unable to cast value to number 'nan'`)
    })

    test('cast booleans', () => {
        expect(Cast.value('true((boolean))')).toBe(true)
        expect(Cast.value('false((boolean))')).toBe(false)
    })

    test('cast arrays', () => {
        expect(Cast.value('((array))')).toEqual([])
        expect(Cast.value('one((array))')).toEqual(['one'])
        expect(Cast.value('one,2((number)),true((boolean))((array))')).toEqual(['one', 2, true])
    })

    test('cast strings', () => {
        expect(Cast.value('yay((string))')).toEqual('yay')
    })

    test('left value untouched if no casting directive were found', () => {
        expect(Cast.value('untouched')).toBe('untouched')
    })

    test('throw when type is invalid', () => {
        expect(() => {
            Cast.value('test((invalid))')
        }).toThrow(`Invalid type provided: invalid 'test((invalid))'`)
    })

    test('cast array of values', () => {
        expect(Cast.array(['1((number))', 'true((boolean))', 'a,b,c((array))'])).toEqual([
            1,
            true,
            ['a', 'b', 'c'],
        ])
    })

    test('cast array of objects', () => {
        expect(
            Cast.objects([{ a: '1((number))' }, { b: 'true((boolean))' }, { c: 'a,b,c((array))' }])
        ).toEqual([{ a: 1 }, { b: true }, { c: ['a', 'b', 'c'] }])
    })

    test('Add a new type to cast', () => {
        Cast.addType('newType', (value: string) => value === 'true')
        expect(Cast.value('test((newType))')).toEqual(false)
    })

    test('throw when trying to add a type without providing a casting function', () => {
        expect(() => {
            Cast.addType('newType2' as CastType, 'test' as unknown as CastFunction)
        }).toThrow('Invalid cast function provided, must be a function')

        expect(() => {
            Cast.value('test((newType2))')
        }).toThrow(`Invalid type provided: newType2 'test((newType2))'`)
    })
})
