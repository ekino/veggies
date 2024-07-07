'use strict'

import { jest } from '@jest/globals'
import statistics from '../../../src/extensions/snapshot/statistics.js'

let logSpy
beforeEach(() => {
    statistics.created = []
    statistics.removed = []
    statistics.updated = []
    logSpy = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(() => {
    logSpy.mockRestore()
})

test('should not print to console snapshot statistics with empty datas', () => {
    statistics.printReport()
    expect(logSpy).toHaveBeenCalledTimes(0)
})

test('should print to console snapshot statistics with data in created', () => {
    statistics.created.push('item')
    statistics.printReport()
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenLastCalledWith(
        '`\n\nSnapshots:   \u001b[32m1 created, \u001b[39m1 total\n',
    )
})

test('should print to console snapshot statistics with data in updated', () => {
    statistics.updated.push('item')
    statistics.printReport()
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenLastCalledWith(
        '`\n\nSnapshots:   \u001b[33m1 updated, \u001b[39m1 total\n',
    )
})

test('should print to console snapshot statistics with data in removed', () => {
    statistics.removed.push('item')
    statistics.printReport()
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenLastCalledWith(
        '`\n\nSnapshots:   \u001b[31m1 removed, \u001b[39m1 total\n',
    )
})
