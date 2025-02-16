import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { hasArg, hasOneArgOf } from '../../../src/utils/command_line.js'

describe('utils > command_line', () => {
    let originalArgv: string[]

    beforeAll(() => {
        originalArgv = process.argv
        process.argv = ['node', 'script.js', '--argOne', '-t', '--three']
        vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterAll(() => {
        process.argv = originalArgv
        vi.restoreAllMocks()
    })

    test('hasArg should return true when the arg is found', () => {
        expect(hasArg('-t')).toBe(true)
    })

    test('hasArg should return false when the arg is not found', () => {
        expect(hasArg('--missing')).toBe(false)
    })

    test('hasOneArgOf should return true when at least an arg is found', () => {
        console.log(process.argv)
        expect(hasOneArgOf(['--argOne', '--notFound'])).toBe(true)
    })

    test('hasOneArgOf should return false when no args are found', () => {
        expect(hasOneArgOf(['--missing', '--notFound'])).toBe(false)
    })
})
