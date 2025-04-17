import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import * as clean from '../../../../src/extensions/snapshot/clean.js'
import * as snapshot from '../../../../src/extensions/snapshot/snapshot.js'

vi.mock('../../../../src/extensions/snapshot/snapshot.js', () => ({
    readSnapshotFile: vi.fn(),
    writeSnapshotFile: vi.fn(),
}))

describe('extensions > snapshot > clean', () => {
    beforeEach(() => {
        clean.resetReferences()
    })

    afterAll(() => {
        vi.restoreAllMocks()
    })

    describe('referenceSnapshot', () => {
        it('referenceSnapshot should add snapshot file and name to internal list', () => {
            const file = './test.js.snap'
            const snapshotName = 'Scenario 1 1.1'

            clean.referenceSnapshot(file, snapshotName)

            expect(clean._snapshots).toEqual({ [file]: [snapshotName] })
        })

        it('resetReferences should remove all entries', () => {
            const file = './test.js.snap'
            const snapshotName = 'Scenario 1 1.1'

            clean.referenceSnapshot(file, snapshotName)
            clean.resetReferences()

            expect(clean._snapshots).toEqual({})
        })
    })

    describe('cleanSnapshots', () => {
        it('should remove unreferenced snapshots from file', () => {
            const file = './test.js.snap'
            const snapshotName = 'Scenario 1 1.1'
            const snapshot2Name = 'Scenario 2 1.1'
            const snapshotContent = {
                [snapshotName]: 'some content',
                [snapshot2Name]: 'another content',
            }
            const expectedContent = { [snapshotName]: 'some content' }

            vi.spyOn(snapshot, 'readSnapshotFile').mockReturnValueOnce(snapshotContent)
            vi.spyOn(snapshot, 'writeSnapshotFile').mockImplementation(() => {})

            clean.referenceSnapshot(file, snapshotName)
            clean.cleanSnapshots()

            expect(snapshot.readSnapshotFile).toHaveBeenCalledTimes(1)
            expect(snapshot.readSnapshotFile).toHaveBeenCalledWith(file)

            expect(snapshot.writeSnapshotFile).toHaveBeenCalledTimes(1)
            expect(snapshot.writeSnapshotFile).toHaveBeenCalledWith(file, expectedContent)
        })

        it('should remove unreferenced snapshots from multiple files', () => {
            const file1 = './test1.js.snap'
            const file2 = './test2.js.snap'
            const snapshot1Name = 'Scenario 1 1.1'
            const snapshot2Name = 'Scenario 2 1.1'
            const snapshot1Content = {
                [snapshot1Name]: 'some content',
                [snapshot2Name]: 'another content',
            }
            const snapshot2Content = {
                [snapshot1Name]: 'some content',
                [snapshot2Name]: 'another content',
            }
            const expectedContent1 = { [snapshot1Name]: 'some content' }
            const expectedContent2 = { [snapshot2Name]: 'another content' }

            vi.spyOn(snapshot, 'readSnapshotFile')
                .mockReturnValueOnce(snapshot1Content)
                .mockReturnValueOnce(snapshot2Content)
            vi.spyOn(snapshot, 'writeSnapshotFile').mockImplementation(() => {})

            clean.referenceSnapshot(file1, snapshot1Name)
            clean.referenceSnapshot(file2, snapshot2Name)

            clean.cleanSnapshots()

            expect(snapshot.readSnapshotFile).toHaveBeenCalledTimes(2)
            expect(snapshot.readSnapshotFile).toHaveBeenCalledWith(file1)
            expect(snapshot.readSnapshotFile).toHaveBeenCalledWith(file2)

            expect(snapshot.writeSnapshotFile).toHaveBeenCalledTimes(2)
            expect(snapshot.writeSnapshotFile).toHaveBeenCalledWith(file1, expectedContent1)
            expect(snapshot.writeSnapshotFile).toHaveBeenCalledWith(file2, expectedContent2)
        })
    })
})
