import { hasExtension, registerExtension } from '../../src/core/registry'

describe('core > registry', () => {
    test('should register an extension', () => {
        const world = {}
        registerExtension(world, 'test')

        expect(world).toHaveProperty('_registredExtensions', ['test'])
    })

    test('should allow to check if an extension were registered', () => {
        expect(hasExtension({}, 'test')).toBe(false)
        expect(hasExtension({ _registredExtensions: [] }, 'test')).toBe(false)
        expect(hasExtension({ _registredExtensions: ['test'] }, 'test')).toBe(true)
    })
})
