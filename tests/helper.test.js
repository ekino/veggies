'use strict'

const Helper = require('../src/helper')

test('should register an extension', () => {
    const world = {}
    Helper.registerExtension(world, 'test')

    expect(world).toHaveProperty('_registredExtensions', ['test'])
})

test('should allow to check if an extension were registered', () => {
    expect(Helper.hasExtension({}, 'test')).toBe(false)
    expect(Helper.hasExtension({ _registredExtensions: [] }, 'test')).toBe(false)
    expect(Helper.hasExtension({ _registredExtensions: ['test'] }, 'test')).toBe(true)
})

test('should allow to count object properties', () => {
    expect(
        Helper.countNestedProperties({
            a: true,
            b: true,
            c: true
        })
    ).toBe(3)

    expect(
        Helper.countNestedProperties({
            a: true,
            b: true,
            c: true,
            d: {
                a: true,
                b: true
            }
        })
    ).toBe(5)
})

test('should allow to count nested objects properties', () => {
    expect(
        Helper.countNestedProperties({
            a: true,
            b: true,
            c: {
                d: 'value1',
                e: 'value2'
            }
        })
    ).toBe(4)
})

test('should allow to count object properties with null, undefined properties ', () => {
    expect(
        Helper.countNestedProperties({
            a: null,
            b: undefined,
            c: 'value3'
        })
    ).toBe(3)
})

test('should allow to count object with properties array property', () => {
    expect(
        Helper.countNestedProperties({
            a: [1, 2],
            b: true,
            c: true
        })
    ).toBe(4)
})

test('should allow to count object properties with empty array property', () => {
    expect(
        Helper.countNestedProperties({
            a: true,
            b: true,
            c: {
                d: '',
                e: []
            }
        })
    ).toBe(4)
})
