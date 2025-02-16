import type { IWorld } from '@cucumber/cucumber'
import { expect, test } from 'vitest'
import * as Registry from '../../../src/core/registry.js'

test('should register an extension', () => {
    const world: IWorld = {} as IWorld
    Registry.registerExtension(world, 'test')

    expect(world).toHaveProperty('_registredExtensions', ['test'])
})

test('should allow to check if an extension were registered', () => {
    const world: IWorld = {} as IWorld

    expect(Registry.hasExtension(world, 'test')).toBe(false)
    expect(Registry.hasExtension({ ...world, _registredExtensions: [] }, 'test')).toBe(false)
    expect(Registry.hasExtension({ ...world, _registredExtensions: ['test'] }, 'test')).toBe(true)
})
