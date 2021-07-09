'use strict'

const snapshot = require('../../../src/extensions/snapshot/snapshot')
const fileSystem = require('../../../src/extensions/snapshot/fs')
const dedent = require('../../../src/extensions/snapshot/dedent')

const { diff } = require('jest-diff')
const diffConstants = require('jest-diff/build/constants')

jest.mock('jest-diff', () => ({ diff: jest.fn() }))

test('parseSnapshotFile should parse snapshot file content', () => {
    const content = dedent`
        """
        \n
        exports[\`scenario 1 1.1\`] = \`some content\`;

        exports[\`scenario 2 1.1\`] = \`another content\`;\n
        """
    `

    const expected = {
        ['scenario 1 1.1']: 'some content',
        ['scenario 2 1.1']: 'another content',
    }

    expect(snapshot.parseSnapshotFile(content)).toEqual(expected)
})

test('formatSnapshotFile should format snapshot file content', () => {
    const content = {
        ['scenario 1 1.1']: 'some content',
        ['scenario 2 1.1']: 'another content',
    }

    const expected = dedent`
        """
        
        
        exports[\`scenario 1 1.1\`] = \`some content\`;

        exports[\`scenario 2 1.1\`] = \`another content\`;
        
        """
    `

    expect(snapshot.formatSnapshotFile(content)).toEqual(expected)
})

test('formatSnapshotFile should format snapshot file content, sort by keys and escape back ticks', () => {
    const content = {
        ['scenario` 1 1.1']: 'some` content`',
        ['scenario 2 1.1']: 'another content',
    }

    const expected = dedent`
        """
        
        
        exports[\`scenario 2 1.1\`] = \`another content\`;

        exports[\`scenario\\\` 1 1.1\`] = \`some\\\` content\\\`\`;
        
        """
    `

    expect(snapshot.formatSnapshotFile(content)).toEqual(expected)
})

test('formatSnapshotFile should normalize new lines', () => {
    const content = {
        ['scenario 1 1.1']: 'some content\rnewline content\r\n',
        ['scenario 2 1.1']: 'another content',
    }

    const expected = dedent`
    """
    
    
    exports[\`scenario 1 1.1\`] = \`some content
    newline content
    \`;

    exports[\`scenario 2 1.1\`] = \`another content\`;
    
    """
    `

    expect(snapshot.formatSnapshotFile(content)).toEqual(expected)
})

describe('diff', () => {
    afterEach(() => {
        diff.mockReset()
    })

    afterAll(() => {
        diff.mockRestore()
    })

    const diffOptions = {
        expand: false,
        colors: true,
        aAnnotation: 'Snapshot',
        bAnnotation: 'Received',
    }

    test('return null when the diff message contains the NO_DIFF_MESSAGE value', () => {
        const expectedContent = `
            Object {
                "key1": "value1",
            }
        `

        const snapshotContent = `
            Object {
                "key1": "value1",
            }
        `

        const diffResult = `This         
             has
             nothing to do with the 
             result!
             -> ${diffConstants.NO_DIFF_MESSAGE} ¯\\_(ツ)_/¯
         `

        diff.mockReturnValue(diffResult)

        const diffMessage = snapshot.diff(snapshotContent, expectedContent)

        expect(diffMessage).toBeNull()

        expect(diff).toHaveBeenNthCalledWith(1, snapshotContent, expectedContent, diffOptions)
    })

    test('return a custom diff message when the diff message is not defined', () => {
        const expectedContent = 'a'

        const snapshotContent = 'b'

        diff.mockReturnValue(undefined)

        const diffMessage = snapshot.diff(snapshotContent, expectedContent)

        const expectedDiffMessage = '\n\u001b[32m- a\u001b[39m \n \u001b[31m+ b\u001b[39m'

        expect(diffMessage).toEqual(expectedDiffMessage)
    })

    test('return the diff message', () => {
        const snapshotContent = `
            Object {
                "key1": "value1",
                "key2": "value2",
                "key3": "value3",
                "key4": "value4",
                "key5": "value5",
            }
        `

        const expectedContent = `
            Object {
                "key1": "value1",
                "key2": "value6",
                "key3": "value3",
                "key4": "value7",
                "key5": "value5",
            }
        `

        const diffResult = `
            """

            \u001b[32m- Snapshot\u001b[39m
            \u001b[31m+ Received\u001b[39m


            \u001b[2m          Object {\u001b[22m
            \u001b[2m              "key1": "value1",\u001b[22m
            \u001b[32m-             "key2": "value2",\u001b[39m
            \u001b[31m+             "key2": "value6",\u001b[39m
            \u001b[2m              "key3": "value3",\u001b[22m
            \u001b[32m-             "key4": "value4",\u001b[39m
            \u001b[31m+             "key4": "value7",\u001b[39m
            \u001b[2m              "key5": "value5",\u001b[22m
            \u001b[2m          }\u001b[22m
            \u001b[2m      \u001b[22m
            """
        `

        diff.mockReturnValue(diffResult)

        const expectedDiffMessage = `\n${diffResult}`

        const diffMessage = snapshot.diff(snapshotContent, expectedContent)

        expect(diffMessage).toEqual(expectedDiffMessage)
    })
})

test('snapshotsPath returns snapshot path', () => {
    const featurePath = 'myfolder/featurefile.feature'
    const expectedPath = 'myfolder/__snapshots__/featurefile.feature.snap'
    const options = {}
    expect(snapshot.snapshotsPath(featurePath, options)).toEqual(expectedPath)
})

test('snapshotsPath returns snapshot path with overrided folder and extension', () => {
    const featurePath = 'myfolder/featurefile.feature'
    const expectedPath = 'myfolder/testsnap/featurefile.feature.sna'
    const options = {
        snaphotsDirname: 'testsnap',
        snapshotsFileExtension: 'sna',
    }
    expect(snapshot.snapshotsPath(featurePath, options)).toEqual(expectedPath)
})

test('writeSnapshotFile should format and write snapshot file', () => {
    const file = 'folder1/feature1.feature'

    const scenario1Snapshot = dedent`
        """
        Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }
        """
    `
    const contentToWrite = { 'scenario 1 1.1': scenario1Snapshot }

    const expectedWrite = dedent`
        """
        
        
        exports[\`scenario 1 1.1\`] = \`Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }\`;
        
        """
    `

    fileSystem.writeFileContent = jest.fn()

    snapshot.writeSnapshotFile(file, contentToWrite)

    expect(fileSystem.writeFileContent.mock.calls.length).toBe(1)
    expect(fileSystem.writeFileContent).toHaveBeenCalledWith(file, expectedWrite)
})

test('readSnapshotFile should read and parse snapshot file', () => {
    const file = 'folder1/feature1.feature'

    const snapshotContent = dedent`
        """
        Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }
        """
    `

    const fileContent = dedent`
        """
        
        
        exports[\`scenario 1 1.1\`] = \`Object {
          "key1": "value1",
          "key2": "value2",
          "key3": "value3",
          "key4": "value4",
          "key5": "value5",
        }\`;
        
        """
    `

    const expectedContent = { 'scenario 1 1.1': snapshotContent }

    fileSystem.getFileInfo = jest.fn()
    fileSystem.getFileContent = jest.fn()

    fileSystem.getFileInfo.mockImplementationOnce(() => {
        return {}
    })
    fileSystem.getFileContent.mockImplementationOnce(() => {
        return fileContent
    })

    expect(snapshot.readSnapshotFile(file)).toEqual(expectedContent)

    expect(fileSystem.getFileInfo.mock.calls.length).toBe(1)
    expect(fileSystem.getFileInfo).toHaveBeenCalledWith(file)

    expect(fileSystem.getFileContent.mock.calls.length).toBe(1)
    expect(fileSystem.getFileContent).toHaveBeenCalledWith(file)
})

test("readSnapshotFile should give an empty object if file doesn't exists", () => {
    const file = 'folder1/feature1.feature'

    const expectedContent = {}

    fileSystem.getFileInfo = jest.fn()
    fileSystem.getFileContent = jest.fn()

    fileSystem.getFileInfo.mockImplementationOnce(() => {
        null
    })

    expect(snapshot.readSnapshotFile(file)).toEqual(expectedContent)

    expect(fileSystem.getFileInfo.mock.calls.length).toBe(1)
    expect(fileSystem.getFileInfo).toHaveBeenCalledWith(file)

    expect(fileSystem.getFileContent.mock.calls.length).toBe(0)
})

test('readSnapshotFile throw an error if no file', () => {
    expect(snapshot.readSnapshotFile).toThrowError(
        /Missing snapshot file undefined to read snapshots/
    )
})

test('prefixSnapshots give a prefix per scenario name', () => {
    const scenarios = [
        { name: 'Scenario 1', line: 10 },
        { name: 'Scenario 2', line: 20 },
    ]

    const expectedResult = {
        10: { name: 'Scenario 1', line: 10, prefix: 'Scenario 1 1' },
        20: { name: 'Scenario 2', line: 20, prefix: 'Scenario 2 1' },
    }

    expect(snapshot.prefixSnapshots(scenarios)).toEqual(expectedResult)
})

test('prefixSnapshots works with duplicate scenarios names', () => {
    const scenarios = [
        { name: 'Scenario 1', line: 10 },
        { name: 'Scenario 2', line: 20 },
        { name: 'Scenario 1', line: 30 },
    ]

    const expectedResult = {
        10: { name: 'Scenario 1', line: 10, prefix: 'Scenario 1 1' },
        20: { name: 'Scenario 2', line: 20, prefix: 'Scenario 2 1' },
        30: { name: 'Scenario 1', line: 30, prefix: 'Scenario 1 2' },
    }

    expect(snapshot.prefixSnapshots(scenarios)).toEqual(expectedResult)
})

test('prefixSnapshots throw an error if no scenarios object', () => {
    expect(snapshot.prefixSnapshots).toThrowError(/Scenarios are required to prefix snapshots/)
})

test('extractScenarios read scenarios names from a file', () => {
    const file = 'folder1/feature1.feature'

    const fileContent = `
        @cli @offline
        Feature: yarn CLI

            Scenario: Running an invalid command
                When I run command yarn invalid
                Then exit code should be 1
                And stderr should contain Command "invalid" not found.

            Scenario: Getting info about installed yarn version
                When I run command yarn --version
                Then exit code should be 0
                And stdout should match ^[0-9]{1}.[0-9]{1,3}.[0-9]{1,3}
                And stderr should be empty
                
            Scenario: Running an invalid command
                When I run command yarn invalid
                Then exit code should be 1
                And stderr should contain Command "invalid" not found.
    `

    const expectedContent = [
        { name: 'Running an invalid command', line: 5 },
        { name: 'Getting info about installed yarn version', line: 10 },
        { name: 'Running an invalid command', line: 16 },
    ]

    fileSystem.getFileContent = jest.fn()
    fileSystem.getFileContent.mockImplementationOnce(() => {
        return fileContent
    })

    expect(snapshot.extractScenarios(file)).toEqual(expectedContent)

    expect(fileSystem.getFileContent.mock.calls.length).toBe(1)
    expect(fileSystem.getFileContent).toHaveBeenCalledWith(file)
})

test('extractScenarios throw an error if no file', () => {
    expect(snapshot.extractScenarios).toThrowError(/Invalid feature file undefined/)
    expect(snapshot.extractScenarios).toThrowError(TypeError)
})
