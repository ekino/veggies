import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as commandLine from '../../../../src/utils/command_line.js'

vi.mock('../../../../src/utils/command_line.js', () => ({
    hasArg: vi.fn(),
    hasOneArgOf: vi.fn(),
}))

describe('Snapshot cmdOptions', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
        process.argv = ['pnpm', 'run', 'cucumber-js']
    })

    it('should set updateSnapshots and cleanSnapshots to false if no args passed', async () => {
        vi.spyOn(commandLine, 'hasArg').mockReturnValueOnce(false)
        vi.spyOn(commandLine, 'hasOneArgOf').mockReturnValueOnce(false)

        const { cleanSnapshots, updateSnapshots } = await import(
            '../../../../src/extensions/snapshot/cmd_options.js'
        )

        expect(updateSnapshots).toBeFalsy()
        expect(cleanSnapshots).toBeFalsy()
    })

    it("should set updateSnapshots to true if '-u' args passed", async () => {
        vi.spyOn(commandLine, 'hasOneArgOf').mockReturnValueOnce(true)

        const { updateSnapshots, cleanSnapshots } = await import(
            '../../../../src/extensions/snapshot/cmd_options.js'
        )

        expect(updateSnapshots).toBeTruthy()
        expect(cleanSnapshots).toBeFalsy()
    })

    it("should set updateSnapshots to true if '--updateSnapshots' args passed", async () => {
        vi.spyOn(commandLine, 'hasOneArgOf').mockReturnValueOnce(true)
        const { updateSnapshots, cleanSnapshots } = await import(
            '../../../../src/extensions/snapshot/cmd_options.js'
        )

        expect(updateSnapshots).toBeTruthy()
        expect(cleanSnapshots).toBeFalsy()
    })

    it("should set cleanSnapshots to true if '--cleanSnapshots' args passed", async () => {
        vi.spyOn(commandLine, 'hasArg').mockReturnValueOnce(true)

        const { cleanSnapshots, updateSnapshots } = await import(
            '../../../../src/extensions/snapshot/cmd_options.js'
        )

        expect(cleanSnapshots).toBeTruthy()
        expect(updateSnapshots).toBeFalsy()
    })

    it('should set both updateSnapshots and cleanSnapshots to true if both args passed', async () => {
        vi.spyOn(commandLine, 'hasArg').mockReturnValueOnce(true)
        vi.spyOn(commandLine, 'hasOneArgOf').mockReturnValueOnce(true)

        const { cleanSnapshots, updateSnapshots } = await import(
            '../../../../src/extensions/snapshot/cmd_options.js'
        )

        expect(updateSnapshots).toBeTruthy()
        expect(cleanSnapshots).toBeTruthy()
    })
})
