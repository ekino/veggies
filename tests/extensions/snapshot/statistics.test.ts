import * as statistics from '../../../src/extensions/snapshot/statistics'
import { SinonStub, stub } from 'sinon'

describe('extensions > snapshot > statistics', () => {
    let logStub: SinonStub
    beforeAll(() => {
        logStub = stub(console, 'log')
    })

    afterEach(() => {
        logStub.reset()
        statistics.reset()
    })
    afterAll(() => logStub.restore())

    test('should not print to console snapshot statistics with empty datas', () => {
        statistics.printReport()
        expect(logStub.notCalled).toBeTruthy()
    })

    test('should print to console snapshot statistics with data in created', () => {
        statistics.created.push({ file: 'file', name: 'item' })
        statistics.printReport()
        expect(
            logStub.calledWithExactly('`\n\nSnapshots:   \u001b[32m1 created, \u001b[39m1 total\n')
        ).toBeTruthy()
    })

    test('should print to console snapshot statistics with data in updated', () => {
        statistics.updated.push({ file: 'file', name: 'item' })
        statistics.printReport()
        expect(
            logStub.calledWithExactly('`\n\nSnapshots:   \u001b[33m1 updated, \u001b[39m1 total\n')
        ).toBeTruthy()
    })

    test('should print to console snapshot statistics with data in removed', () => {
        statistics.removed.push({ file: 'file', name: 'item' })
        statistics.printReport()
        expect(
            logStub.calledWithExactly('`\n\nSnapshots:   \u001b[31m1 removed, \u001b[39m1 total\n')
        ).toBeTruthy()
    })

    test('should reset to empty value', () => {
        statistics.created.push({ file: 'file', name: 'item' })
        statistics.updated.push({ file: 'file', name: 'item' })
        statistics.removed.push({ file: 'file', name: 'item' })
        statistics.reset()
        expect(statistics.created).toEqual([])
        expect(statistics.updated).toEqual([])
        expect(statistics.removed).toEqual([])
    })
})
