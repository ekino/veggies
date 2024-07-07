'use strict'

import * as Registry from '../../src/core/registry.js'

test('should register an extension', () => {
    const world = {}
    Registry.registerExtension(world, 'test')

    expect(world).toHaveProperty('_registredExtensions', ['test'])
})

test('should allow to check if an extension were registered', () => {
    expect(Registry.hasExtension({}, 'test')).toBe(false)
    expect(Registry.hasExtension({ _registredExtensions: [] }, 'test')).toBe(false)
    expect(Registry.hasExtension({ _registredExtensions: ['test'] }, 'test')).toBe(true)
})
