import { describe, it, expect, beforeEach, afterAll, afterEach, vi } from 'vitest'
import * as statistics from '../../../../src/extensions/snapshot/statistics.js'

const stripAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, '')

describe('extensions > snapshot > statistics', () => {
    let logSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        statistics.created.length = 0
        statistics.removed.length = 0
        statistics.updated.length = 0
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        logSpy.mockRestore()
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })

    it('should not print to console snapshot statistics with empty data', () => {
        statistics.printReport()
        expect(logSpy).not.toHaveBeenCalled()
    })

    it('should print to console snapshot statistics with data in created', () => {
        statistics.created.push({ file: '/item', name: 'item' })
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(stripAnsi(logSpy.mock.calls?.[0]?.[0] as string)).toContain('1 created, 1 total')
    })

    it('should print to console snapshot statistics with data in updated', () => {
        statistics.updated.push({ file: '/item', name: 'item' })
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(stripAnsi(logSpy.mock.calls?.[0]?.[0] as string)).toContain('1 updated, 1 total')
    })

    it('should print to console snapshot statistics with data in removed', () => {
        statistics.removed.push({ file: '/item', name: 'item' })
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(stripAnsi(logSpy.mock.calls?.[0]?.[0] as string)).toContain('1 removed, 1 total')
    })
})
