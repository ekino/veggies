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
