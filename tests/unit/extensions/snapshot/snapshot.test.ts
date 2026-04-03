import type { Stats } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dedent } from '../../../../src/extensions/snapshot/dedent.js'
import * as fileSystem from '../../../../src/extensions/snapshot/fs.js'
import * as snapshot from '../../../../src/extensions/snapshot/snapshot.js'

vi.mock('../../../../src/extensions/snapshot/fs.js', () => ({
    getFileInfo: vi.fn(),
    getFileContent: vi.fn(),
    writeFileContent: vi.fn(),
}))

describe('extensions > snapshot > snapshot', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('parseSnapshotFile should parse snapshot file content', () => {
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

    it('formatSnapshotFile should format snapshot file content', () => {
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

    it('formatSnapshotFile should format snapshot file content, sort by keys and escape back ticks', () => {
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

    it('formatSnapshotFile should normalize new lines', () => {
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
            vi.resetAllMocks()
        })

        it('return null when the diff message contains the NO_DIFF_MESSAGE value', () => {
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

            const diffMessage = snapshot.diff(snapshotContent, expectedContent)

            expect(diffMessage).toBeUndefined()
        })

        it('return a properly formatted diff message for simple content differences', () => {
            const expectedContent = 'a'
            const snapshotContent = 'b'

            const diffMessage = snapshot.diff(snapshotContent, expectedContent)

            // Verify the diff contains the header and content
            expect(diffMessage).toBeDefined()
            expect(diffMessage).toContain('- Snapshot')
            expect(diffMessage).toContain('+ Received')
            expect(diffMessage).toContain('- b') // snapshot content with removal color
            expect(diffMessage).toContain('+ a') // expected content with addition color

            // Verify structure starts with newline
            expect(diffMessage).toMatch(/^\n/)
        })

        it('return the diff message for multiline content with changes', () => {
            const snapshotContent = `Object {
  "key1": "value1",
  "key2": "value2",
  "key4": "value4",
}`

            const expectedContent = `Object {
  "key1": "value1",
  "key2": "value6",
  "key4": "value7",
}`

            const diffMessage = snapshot.diff(snapshotContent, expectedContent)

            // Verify that the diff message exists and contains expected elements
            expect(diffMessage).toBeDefined()
            expect(diffMessage).toContain('- Snapshot')
            expect(diffMessage).toContain('+ Received')

            // Check that it shows the differences
            expect(diffMessage).toContain('value2') // old value
            expect(diffMessage).toContain('value6') // new value
            expect(diffMessage).toContain('value4') // old value
            expect(diffMessage).toContain('value7') // new value

            // Verify structure starts with newline
            expect(diffMessage).toMatch(/^\n/)
        })
    })

    it('snapshotsPath returns snapshot path', () => {
        const featurePath = 'myfolder/featurefile.feature'
        const expectedPath = 'myfolder/__snapshots__/featurefile.feature.snap'
        const options = {}
        expect(snapshot.snapshotsPath(featurePath, options)).toEqual(expectedPath)
    })

    it('snapshotsPath returns snapshot path with overridden folder and extension', () => {
        const featurePath = 'myfolder/featurefile.feature'
        const expectedPath = 'myfolder/testsnap/featurefile.feature.sna'
        const options = {
            snapshotsDirname: 'testsnap',
            snapshotsFileExtension: 'sna',
        }
        expect(snapshot.snapshotsPath(featurePath, options)).toEqual(expectedPath)
    })

    it('writeSnapshotFile should format and write snapshot file', () => {
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

        vi.spyOn(fileSystem, 'writeFileContent').mockImplementation(() => {})

        snapshot.writeSnapshotFile(file, contentToWrite)

        expect(fileSystem.writeFileContent).toHaveBeenCalledTimes(1)
        expect(fileSystem.writeFileContent).toHaveBeenCalledWith(file, expectedWrite)
    })

    it('readSnapshotFile should read and parse snapshot file', () => {
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

        vi.spyOn(fileSystem, 'getFileInfo').mockImplementationOnce(() => ({}) as Stats)
        vi.spyOn(fileSystem, 'getFileContent').mockImplementationOnce(() => fileContent)

        expect(snapshot.readSnapshotFile(file)).toEqual(expectedContent)

        expect(fileSystem.getFileInfo).toHaveBeenCalledTimes(1)
        expect(fileSystem.getFileInfo).toHaveBeenCalledWith(file)

        expect(fileSystem.getFileContent).toHaveBeenCalledTimes(1)
        expect(fileSystem.getFileContent).toHaveBeenCalledWith(file)
    })

    it("readSnapshotFile should give an empty object if file doesn't exist", () => {
        const file = 'folder1/feature1.feature'

        const expectedContent = {}

        vi.spyOn(fileSystem, 'getFileInfo').mockImplementationOnce(() => undefined)

        expect(snapshot.readSnapshotFile(file)).toEqual(expectedContent)

        expect(fileSystem.getFileInfo).toHaveBeenCalledTimes(1)
        expect(fileSystem.getFileInfo).toHaveBeenCalledWith(file)

        expect(fileSystem.getFileContent).not.toHaveBeenCalled()
    })

    it('prefixSnapshots should give a prefix per scenario name', () => {
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

    it('prefixSnapshots should work with duplicate scenario names', () => {
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

    it('prefixSnapshots should throw an error if no scenarios object', () => {
        expect(() => snapshot.prefixSnapshots(undefined)).toThrowError(
            /Scenarios are required to prefix snapshots/
        )
    })

    it('extractScenarios should read scenario names from a file', () => {
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

        vi.spyOn(fileSystem, 'getFileContent').mockImplementationOnce(() => fileContent)

        expect(snapshot.extractScenarios(file)).toEqual(expectedContent)

        expect(fileSystem.getFileContent).toHaveBeenCalledTimes(1)
        expect(fileSystem.getFileContent).toHaveBeenCalledWith(file)
    })
})
