'use strict'

import { jest } from '@jest/globals'
import * as clean from '../../../../src/extensions/snapshot/clean.js'

const readSnapshotFileMock = jest.fn()
const writeSnapshotFileMock = jest.fn()
beforeAll(() => {
    jest.unstable_mockModule('../../../../src/extensions/snapshot/snapshot.js', () => ({
        readSnapshotFile: readSnapshotFileMock,
        writeSnapshotFile: writeSnapshotFileMock,
    }))
})

beforeEach(() => {
    clean.resetReferences()
    jest.clearAllMocks()
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

test('cleanSnapshots should remove unreferenced snapshots from file', () => {
    const file = './test.js.snap'
    const snapshotName = 'Scenario 1 1.1'
    const snapshot2Name = 'Scenario 2 1.1'
    const snapshotContent = { [snapshotName]: 'some content', [snapshot2Name]: 'another content' }
    const expectedContent = { [snapshotName]: 'some content' }

    clean.referenceSnapshot(file, snapshotName)

    readSnapshotFileMock.mockReturnValueOnce(snapshotContent)

    clean.cleanSnapshots()

    expect(readSnapshotFileMock.mock.calls.length).toBe(1)
    expect(readSnapshotFileMock).toHaveBeenCalledWith(file)

    expect(writeSnapshotFileMock.mock.calls.length).toBe(1)
    expect(writeSnapshotFileMock).toHaveBeenCalledWith(file, expectedContent)
})

test('cleanSnapshots should remove unreferenced snapshots from multiple files', () => {
    const file1 = './test1.js.snap'
    const file2 = './test2.js.snap'
    const snapshot1Name = 'Scenario 1 1.1'
    const snapshot2Name = 'Scenario 2 1.1'
    const snapshot1Content = { [snapshot1Name]: 'some content', [snapshot2Name]: 'another content' }
    const snapshot2Content = { [snapshot1Name]: 'some content', [snapshot2Name]: 'another content' }
    const expectedContent1 = { [snapshot1Name]: 'some content' }
    const expectedContent2 = { [snapshot2Name]: 'another content' }

    clean.referenceSnapshot(file1, snapshot1Name)
    clean.referenceSnapshot(file2, snapshot2Name)

    readSnapshotFileMock.mockReturnValueOnce(snapshot1Content)
    readSnapshotFileMock.mockReturnValueOnce(snapshot2Content)

    clean.cleanSnapshots()

    expect(readSnapshotFileMock.mock.calls.length).toBe(2)
    expect(readSnapshotFileMock).toHaveBeenCalledWith(file1)
    expect(readSnapshotFileMock).toHaveBeenCalledWith(file2)

    expect(writeSnapshotFileMock.mock.calls.length).toBe(2)
    expect(writeSnapshotFileMock).toHaveBeenCalledWith(file1, expectedContent1)
    expect(writeSnapshotFileMock).toHaveBeenCalledWith(file2, expectedContent2)
})
