import { describe, expect, it } from 'vitest'
import type { Predicate, VeggiesError } from '../../../src/types.js'
import {
    findKey,
    getError,
    getType,
    getValue,
    isDefined,
    isEmpty,
    isFunction,
    isNotNullsy,
    isNullsy,
    isNumber,
    isPlainObject,
    isString,
    mapValues,
    omit,
    partial,
    pick,
    setValue,
    template,
} from '../../../src/utils/index.js'

describe('utils > index', () => {
    describe('isNumber', () => {
        it('should return true for finite numbers', () => {
            expect(isNumber(1)).toBe(true)
            expect(isNumber(0)).toBe(true)
            expect(isNumber(-1)).toBe(true)
            expect(isNumber(1.5)).toBe(true)
        })

        it('should return false for non-finite numbers and other types', () => {
            expect(isNumber(Number.NaN)).toBe(false)
            expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false)
            expect(isNumber('1')).toBe(false)
            expect(isNumber({})).toBe(false)
            expect(isNumber([])).toBe(false)
            expect(isNumber(null)).toBe(false)
            expect(isNumber(undefined)).toBe(false)
        })
    })

    describe('isNullsy', () => {
        it('should return true for undefined', () => {
            expect(isNullsy(undefined)).toBe(true)
        })

        it('should return true for null', () => {
            expect(isNullsy(null)).toBe(true)
        })

        it('should return false for non-nullsy values', () => {
            expect(isNullsy('')).toBe(false)
            expect(isNullsy(0)).toBe(false)
            expect(isNullsy(false)).toBe(false)
            expect(isNullsy([])).toBe(false)
            expect(isNullsy({})).toBe(false)
        })
    })

    describe('isNotNullsy', () => {
        it('should return false for undefined', () => {
            expect(isNotNullsy(undefined)).toBe(false)
        })

        it('should return false for null', () => {
            expect(isNotNullsy(null)).toBe(false)
        })

        it('should return true for non-nullsy values', () => {
            expect(isNotNullsy('')).toBe(true)
            expect(isNotNullsy(0)).toBe(true)
            expect(isNotNullsy(false)).toBe(true)
            expect(isNotNullsy([])).toBe(true)
            expect(isNotNullsy({})).toBe(true)
        })
    })

    describe('isEmpty', () => {
        it('should return true for undefined, null, empty strings, empty objects, and empty arrays', () => {
            expect(isEmpty(undefined)).toBe(true)
            expect(isEmpty(null)).toBe(true)
            expect(isEmpty('')).toBe(true)
            expect(isEmpty({})).toBe(true)
            expect(isEmpty([])).toBe(true)
        })

        it('should return false for non-empty strings, objects, and arrays', () => {
            expect(isEmpty('text')).toBe(false)
            expect(isEmpty({ key: 'value' })).toBe(false)
            expect(isEmpty([1, 2, 3])).toBe(false)
            expect(isEmpty(0)).toBe(false)
            expect(isEmpty(false)).toBe(false)
        })
    })

    describe('isDefined', () => {
        it('should return true for defined values', () => {
            expect(isDefined('string')).toBe(true)
            expect(isDefined(123)).toBe(true)
            expect(isDefined([])).toBe(true)
            expect(isDefined({})).toBe(true)
            expect(isDefined(true)).toBe(true)
        })

        it('should return false for undefined and null', () => {
            expect(isDefined(undefined)).toBe(false)
            expect(isDefined(null)).toBe(false)
        })
    })

    describe('isString', () => {
        it('should return true for strings', () => {
            expect(isString('')).toBe(true)
            expect(isString('text')).toBe(true)
        })

        it('should return false for non-strings', () => {
            expect(isString(1)).toBe(false)
            expect(isString([])).toBe(false)
            expect(isString({})).toBe(false)
            expect(isString(null)).toBe(false)
            expect(isString(undefined)).toBe(false)
            expect(isString(true)).toBe(false)
        })
    })

    describe('isFunction', () => {
        it('should return true for functions', () => {
            expect(isFunction(() => {})).toBe(true)
            expect(isFunction(() => {})).toBe(true)
        })

        it('should return false for non-functions', () => {
            expect(isFunction('text')).toBe(false)
            expect(isFunction(123)).toBe(false)
            expect(isFunction([])).toBe(false)
            expect(isFunction({})).toBe(false)
            expect(isFunction(null)).toBe(false)
            expect(isFunction(undefined)).toBe(false)
            expect(isFunction(true)).toBe(false)
        })
    })

    describe('getValue', () => {
        it('should return the value at the specified path when the path exists', () => {
            const obj = { a: { b: { c: 42 } } }
            expect(getValue(obj, 'a.b.c')).toBe(42)
            expect(getValue(obj, ['a', 'b', 'c'])).toBe(42)
        })

        it('should return undefined when the path does not exist', () => {
            const obj: Record<string, unknown> = { a: { b: {} } }
            expect(getValue(obj, 'a.b.c')).toBeUndefined()
        })

        it('should return undefined when the path is partially missing', () => {
            const obj = { a: { b: {} } }
            expect(getValue(obj, 'a.b.c')).toBeUndefined()
        })

        it('should return undefined when the path does not exist and no defaultValue is provided', () => {
            const obj = { a: { b: {} } }
            expect(getValue(obj, 'a.b.c')).toBeUndefined()
        })

        it('should return the object itself when the path is empty', () => {
            const obj = { a: { b: { c: 42 } } }
            expect(getValue(obj, [])).toBe(obj)
        })

        it('should return undefined when the object is null', () => {
            expect(getValue(null, 'a.b.c')).toBeUndefined()
        })

        it('should return undefined when the path is empty and object is null', () => {
            expect(getValue(null, [])).toBeUndefined()
        })

        it('should return correct value from complex array object', () => {
            const obj = {
                contents: [
                    {
                        contentID: 519,
                        isInOffer: true,
                        ratings: [{ value: '1', authority: 'csa' }],
                        onClick: {
                            adult: true,
                            params: [
                                {
                                    in: 'params',
                                    enum: ['jh'],
                                },
                            ],
                        },
                    },
                ],
                'some.key': 'test',
                'nested.key[1]': 'wrong',
            }
            expect(getValue(obj, 'some.key')).toEqual('test')
            expect(getValue(obj, 'contents[0].contentID')).toEqual(519)
            expect(getValue(obj, ['contents', 0, 'contentID'])).toEqual(519)
            expect(getValue(obj, 'contents[0].onClick.params[0].enum[0]')).toEqual('jh')
            expect(getValue(obj, 'contents[0].onClick.adult')).toEqual(true)
            expect(getValue(obj, 'contents[1].contentID')).toBeUndefined()
            expect(getValue(obj, 'nested.key[1]')).toEqual('wrong')
        })
    })

    describe('setValue', () => {
        it('should set the value at the specified path when the path exists', () => {
            const obj = { a: { b: { c: 42 } } }
            setValue(obj, 'a.b.c', 100)
            expect(obj.a.b.c).toBe(100)
        })

        it('should create intermediate objects and set the value when the path does not exist', () => {
            const obj = { a: { b: { c: undefined } } }
            setValue(obj, 'a.b.c', 100)
            expect(obj.a.b.c).toBe(100)
        })

        it('should overwrite existing values at the path', () => {
            const obj = { a: { b: { c: 42 } } }
            setValue(obj, 'a.b.c', 100)
            expect(obj.a.b.c).toBe(100)
        })

        it('should handle path as an array', () => {
            const obj = { x: { y: { z: undefined } } }
            setValue(obj, ['x', 'y', 'z'], 200)
            expect(obj.x.y.z).toBe(200)
        })

        it('should handle empty path and value correctly', () => {
            const obj = {}
            setValue(obj, [], 'test')
            expect(obj).toEqual({})
        })

        it('should handle non-object input gracefully', () => {
            const result = setValue(null, 'a.b.c', 100)
            expect(result).toBe(null)
        })

        it('should handle non-object root with valid path and value', () => {
            const result = setValue(42, 'a.b.c', 100)
            expect(result).toBe(42)
        })

        it('should set correct value in complex array object', () => {
            const obj = {
                contents: [
                    {
                        contentID: 519,
                        isInOffer: true,
                        ratings: [{ value: '1', authority: 'csa' }],
                        onClick: {
                            adult: true,
                            params: [
                                {
                                    in: 'params',
                                    enum: ['jh'],
                                },
                            ],
                        },
                    },
                ],
                'some.key': 'test',
                'nested.key[1]': 'wrong',
            }

            setValue(obj, 'contents[0].contentID', 1000)
            setValue(obj, 'contents[0].onClick.params[0].enum[1]', 'jk')
            setValue(obj, 'nested.key[0]', 'correct')
            setValue(obj, 'some.newKey', 'newValue')
            setValue(obj, 'new.array[0]', 'firstItem')

            expect(getValue(obj, 'contents[0].contentID')).toEqual(1000)
            expect(getValue(obj, 'contents[0].onClick.params[0].enum[1]')).toEqual('jk')
            expect(getValue(obj, 'nested.key[0]')).toEqual('correct')
            expect(getValue(obj, 'some.newKey')).toEqual('newValue')
            expect(getValue(obj, 'new.array[0]')).toEqual('firstItem')

            expect(getValue(obj, 'some.key')).toEqual('test')
            expect(getValue(obj, 'nested.key[1]')).toEqual('wrong')
        })
    })

    describe('isPlainObject', () => {
        it('should return true for plain objects created with {}', () => {
            expect(isPlainObject({})).toBe(true)
        })

        it('should return true for plain objects created with Object.create(null)', () => {
            const obj = Object.create(null)
            expect(isPlainObject(obj)).toBe(true)
        })

        it('should return false for arrays', () => {
            expect(isPlainObject([])).toBe(false)
        })

        it('should return false for functions', () => {
            expect(isPlainObject(() => {})).toBe(false)
        })

        it('should return false for null', () => {
            expect(isPlainObject(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isPlainObject(undefined)).toBe(false)
        })

        it('should return false for instances of custom classes', () => {
            class CustomClass {}
            const instance = new CustomClass()
            expect(isPlainObject(instance)).toBe(false)
        })

        it('should return false for primitive types', () => {
            expect(isPlainObject(42)).toBe(false)
            expect(isPlainObject('string')).toBe(false)
            expect(isPlainObject(true)).toBe(false)
        })
    })

    describe('template', () => {
        it('should replace placeholders with corresponding values from data with special characters', () => {
            const tpl = 'Your order ${orderNumber} is ready at ${location}!'
            const tplFn = template(tpl)
            const result = tplFn({ orderNumber: '1234', location: 'Main Street' })
            expect(result).toBe('Your order 1234 is ready at Main Street!')
        })

        it('should return the template string unchanged if no placeholders are present', () => {
            const tpl = 'No placeholders here!'
            const tplFn = template(tpl)
            const result = tplFn({ name: 'Alice' })
            expect(result).toBe('No placeholders here!')
        })

        it('should handle multiple same placeholders correctly', () => {
            const tpl = 'Hello ${name}, ${name}!'
            const tplFn = template(tpl)
            const result = tplFn({ name: 'Eve' })
            expect(result).toBe('Hello Eve, Eve!')
        })
    })

    describe('mapValues', () => {
        it('should apply the function to each value in the object and return a new object', () => {
            const obj = { a: 1, b: 2, c: 3 }
            const fn = (value: number) => value * 2
            const result = mapValues(obj, fn)
            expect(result).toEqual({ a: 2, b: 4, c: 6 })
        })

        it('should handle an empty object', () => {
            const obj = {}
            const fn = (value: number) => value + 1
            const result = mapValues(obj, fn)
            expect(result).toEqual({})
        })
    })

    describe('findKey', () => {
        it('should return the key where the value satisfies the predicate', () => {
            const obj = { a: 1, b: 2, c: 3 }
            const predicate: Predicate<number> = (value?: number) => (value && value > 1) || false
            const result = findKey(obj, predicate)
            expect(result).toBe('b')
        })

        it('should return undefined if no value satisfies the predicate', () => {
            const obj = { a: 1, b: 2, c: 3 }
            const predicate: Predicate<number> = (value?: number) => (value && value > 3) || false
            const result = findKey(obj, predicate)
            expect(result).toBeUndefined()
        })
    })

    describe('pick', () => {
        it('should return an object with only the specified keys from the source object', () => {
            const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
            const keys = ['a', 'c']
            const result = pick(obj, keys)
            expect(result).toEqual({ a: 1, c: 3 })
        })

        it('should return an empty object if no keys are specified', () => {
            const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
            const keys: string[] = []
            const result = pick(obj, keys)
            expect(result).toEqual({})
        })

        it('should return an empty object if the source object is null or undefined', () => {
            expect(pick(null, ['a', 'b'])).toEqual({})
            expect(pick(undefined, ['a', 'b'])).toEqual({})
        })

        it('should handle keys that do not exist in the source object gracefully', () => {
            const obj: Record<string, number> = { a: 1, b: 2 }
            const keys = ['a', 'c']
            const result = pick(obj, keys)
            expect(result).toEqual({ a: 1 })
        })
    })

    describe('utils > omit', () => {
        it('should return an object with all keys except those specified', () => {
            const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
            const keysToOmit = ['b', 'c']
            const result = omit(obj, keysToOmit)
            expect(result).toEqual({ a: 1 })
        })

        it('should return the original object if no keys are specified to omit', () => {
            const obj: Record<string, number> = { a: 1, b: 2, c: 3 }
            const keysToOmit: string[] = []
            const result = omit(obj, keysToOmit)
            expect(result).toEqual({ a: 1, b: 2, c: 3 })
        })

        it('should return an empty object if the source object is null or undefined', () => {
            expect(omit(null, ['a', 'b'])).toEqual({})
            expect(omit(undefined, ['a', 'b'])).toEqual({})
        })

        it('should handle keys that do not exist in the source object gracefully', () => {
            const obj: Record<string, number> = { a: 1, b: 2 }
            const keysToOmit = ['c']
            const result = omit(obj, keysToOmit)
            expect(result).toEqual({ a: 1, b: 2 })
        })
    })

    describe('partial', () => {
        it('should create a function with the initial arguments pre-filled', () => {
            const add = (a: string, b: string, c: string) => a + b + c
            const addPartial = partial(add, 1, 2)
            const result = addPartial(3)
            expect(result).toBe(6)
        })

        it('should handle functions with no initial arguments', () => {
            const greet = (salutation: string, name: string) => `${salutation}, ${name}!`
            const greetPartial = partial(greet, 'Hello')
            const result = greetPartial('Alice')
            expect(result).toBe('Hello, Alice!')
        })
    })

    describe('getError', () => {
        it('should return an error object with the message from an object', () => {
            const error = { message: 'An error occurred', code: 500 }
            const result: VeggiesError = getError(error)
            expect(result).toEqual({ ...error, message: 'An error occurred' })
        })

        it('should return an error object with the message from a string', () => {
            const error = 'An error occurred'
            const result: VeggiesError = getError(error)
            expect(result).toEqual({ message: error })
        })

        it('should return an error object with "unknown error" message for null', () => {
            const result: VeggiesError = getError(null)
            expect(result).toEqual({ message: 'unknown error' })
        })

        it('should return an error object with "unknown error" message for undefined', () => {
            const result: VeggiesError = getError(undefined)
            expect(result).toEqual({ message: 'unknown error' })
        })

        it('should return an error object with the stringified message for non-object, non-string errors', () => {
            const error = 12345
            const result: VeggiesError = getError(error)
            expect(result).toEqual({ message: JSON.stringify(error) })
        })

        it('should return an error object with the stringified message for array errors', () => {
            const error = [1, 2, 3]
            const result: VeggiesError = getError(error)
            expect(result).toEqual({ message: JSON.stringify(error) })
        })
    })

    describe('getType', () => {
        it('should return "array" for arrays', () => {
            expect(getType([])).toBe('array')
        })

        it('should return "null" for null', () => {
            expect(getType(null)).toBe('null')
        })

        it('should return "date" for Date objects', () => {
            expect(getType(new Date())).toBe('date')
        })

        it('should return "regexp" for RegExp objects', () => {
            expect(getType(/test/)).toBe('regexp')
        })

        it('should return "object" for plain objects', () => {
            expect(getType({})).toBe('object')
        })

        it('should return "string" for strings', () => {
            expect(getType('test')).toBe('string')
        })

        it('should return "number" for numbers', () => {
            expect(getType(123)).toBe('number')
        })

        it('should return "boolean" for booleans', () => {
            expect(getType(true)).toBe('boolean')
        })

        it('should return "undefined" for undefined', () => {
            expect(getType(undefined)).toBe('undefined')
        })

        it('should return "function" for functions', () => {
            expect(getType(() => {})).toBe('function')
        })
    })
})
