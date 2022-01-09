import * as clean from '../../../src/extensions/snapshot/clean'
import * as snapshotAction from '../../../src/extensions/snapshot/snapshot_actions'
import { createSandbox, SinonStub } from 'sinon'

describe('extensions > snapshot', () => {
    beforeEach(() => {
        clean.resetReferences()
    })

    test('referenceSnapshot should add snapshot file and name to internal list', () => {
        const file = './test.js.snap'
        const snapshotName = 'Scenario 1 1.1'

        clean.referenceSnapshot(file, snapshotName)

        expect(clean._snapshots).toEqual({ [file]: [snapshotName] })
    })

    test('resetReferences should remove all entries', () => {
        const file = './test.js.snap'
        const snapshotName = 'Scenario 1 1.1'

        clean.referenceSnapshot(file, snapshotName)
        clean.resetReferences()

        expect(clean._snapshots).toEqual({})
    })

    describe('cleanSnapshots', () => {
        const sandbox = createSandbox()
        let readSnapshotFileStub: SinonStub, writeSnapshotFileStub: SinonStub

        beforeAll(() => {
            readSnapshotFileStub = sandbox.stub(snapshotAction, 'readSnapshotFile')
            writeSnapshotFileStub = sandbox.stub(snapshotAction, 'writeSnapshotFile')
        })

        afterEach(() => sandbox.reset())
        afterAll(() => sandbox.restore())

        it('should remove unreferenced snapshots from file', () => {
            const file = './test.js.snap'
            const snapshotName = 'Scenario 1 1.1'
            const snapshot2Name = 'Scenario 2 1.1'
            const snapshotContent = {
                [snapshotName]: 'some content',
                [snapshot2Name]: 'another content',
            }
            const expectedContent = { [snapshotName]: 'some content' }

            clean.referenceSnapshot(file, snapshotName)

            readSnapshotFileStub.withArgs(file).returns(snapshotContent)

            clean.cleanSnapshots()

            expect(readSnapshotFileStub.calledOnce).toBeTruthy()
            expect(writeSnapshotFileStub.calledWithExactly(file, expectedContent)).toBeTruthy()
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

            clean.referenceSnapshot(file1, snapshot1Name)
            clean.referenceSnapshot(file2, snapshot2Name)

            readSnapshotFileStub.withArgs(file1).returns(snapshot1Content)
            readSnapshotFileStub.withArgs(file2).returns(snapshot2Content)

            clean.cleanSnapshots()

            expect(readSnapshotFileStub.calledTwice).toBeTruthy()
            expect(writeSnapshotFileStub.calledWithExactly(file1, expectedContent1)).toBeTruthy()
            expect(writeSnapshotFileStub.calledWithExactly(file2, expectedContent2)).toBeTruthy()
        })
    })
})
