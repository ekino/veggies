'use strict'

const statistics = require('../../../../lib/cjs/extensions/snapshot/statistics.js')

// eslint-disable-next-line no-control-regex
const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '')

describe('extensions > snapshot > statistics', () => {
    let logSpy
    beforeEach(() => {
        statistics.created.length = 0
        statistics.removed.length = 0
        statistics.updated.length = 0
        logSpy = jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
        logSpy.mockRestore()
    })
    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('should not print to console snapshot statistics with empty datas', () => {
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(0)
    })

    test('should print to console snapshot statistics with data in created', () => {
        statistics.created.push('item')
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(stripAnsi(logSpy.mock.calls[0][0])).toContain('1 created, 1 total')
    })

    test('should print to console snapshot statistics with data in updated', () => {
        statistics.updated.push('item')
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(stripAnsi(logSpy.mock.calls[0][0])).toContain('1 updated, 1 total')
    })

    test('should print to console snapshot statistics with data in removed', () => {
        statistics.removed.push('item')
        statistics.printReport()
        expect(logSpy).toHaveBeenCalledTimes(1)
        expect(stripAnsi(logSpy.mock.calls[0][0])).toContain('1 removed, 1 total')
    })
})
