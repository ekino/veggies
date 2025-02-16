import { dedent } from '../../../../lib/cjs/extensions/snapshot/dedent.js'

export const featureFileContent1 = dedent`
    """
    Feature: Snapshot test

        Scenario: scenario 1
            When I do something...

        Scenario: scenario 2
            When I do something...

        Scenario: scenario 1
            When I do something...
    """
`

export const snapshotContent1 = dedent`
Object {
  "key1": "value1",
  "key2": "value2",
  "key3": "value3",
  "key4": "value4",
  "key5": "value5",
}
`

export const snapshotContent2 = dedent`
Object {
  "key1": "value1",
  "key2": "value2",
  "key3": "value8",
  "key4": "value4",
  "key5": "value5",
}
;`

export const snapshotContent3 = dedent`
Object {
  "key1": "value1",
  "key2": "value2",
  "key3": "value9",
  "key4": "value4",
  "key5": "value5",
}
;`

export const snapshotContent1WithPropertyMatchers = dedent`
Object {
  "key1": "value1",
  "key2": "type(string)",
  "key3": "value3",
  "key4": "value4",
  "key5": "value5",
}
;`

export const snapshotContentMultilineString = dedent`
Object {
  "content": Object {
    "long text": "I
 am
 a
 long
 text",
    "text": "i am a text",
  },
}
;`

export const snapshotFileContent1 = `

exports[\`scenario 1 1.1\`] = \`${snapshotContent1}\`;
`

export const snapshotFileContent1WithPropertyMatchers = `

exports
[\`scenario 1 1.1\`] = \`${snapshotContent1WithPropertyMatchers}\`;
`

export const snapshotFileContent1And2 = `

exports[\`scenario 1 1.1\`] = \`${snapshotContent1}\`;

exports[\`scenario 2 1.1\`] = \`${snapshotContent2}\`;
`

export const snapshotFileContent1And2And3 = `

exports[\`scenario 1 1.1\`] = \`${snapshotContent1}\`;

exports[\`scenario 1 2.1\`] = \`${snapshotContent3}\`;

exports[\`scenario 2 1.1\`] = \`${snapshotContent2}\`;
`

export const snapshotFileContent1With2SnapshotsInAScenario = `

exports[\`scenario 1 1.1\`] = \`${snapshotContent1}\`;

exports[\`scenario 1 1.2\`] = \`${snapshotContent2}\`;
`

export const snapshotFileContent1With3SnapshotsInAScenario = `

exports[\`scenario 1 1.1\`] = \`${snapshotContent1}\`;

exports[\`scenario 1 1.2\`] = \`${snapshotContent2}\`;

exports[\`scenario 1 1.3\`] = \`${snapshotContent3}\`;
`

export const snapshotFileContent1WithValue2 = `

exports[\`scenario 1 1.1\`] = \`${snapshotContent2}\`;
`

export const snapshotFileContentMultilineString = `

exports[\`scenario 1 1.1\`] = \`${snapshotContentMultilineString}\`;

`

export const value1 = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
    key4: 'value4',
    key5: 'value5',
}
export const value1WithError = {
    key1: 'value1',
    key2: 2,
    key3: 'value3',
    key4: 'value4',
    key5: 'value5',
}
export const value2 = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value8',
    key4: 'value4',
    key5: 'value5',
}
export const value3 = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value9',
    key4: 'value4',
    key5: 'value5',
}
export const multilineValue = {
    content: { text: 'i am a text', 'long text': 'I\r\n am \r\n a\r\n long\r\n text' },
}

export const featureFile1 = './snapshot1.feature'
export const featureFile1WithPropertyMatchers = './snapshot1WithPropertyMatchers.feature'
export const featureFile1And2 = './snapshot1And2.feature'
export const featureFile1NotExists = './snapshot1NotExists.feature'
export const featureFile1With2SnapshotsInAScenario = './snapshot1With2SnapshotsInAScenario.feature'
export const featureFile1With3SnapshotsInAScenario = './snapshot1With3SnapshotsInAScenario.feature'
export const featureFileMultilineString = './snapshotMultilineString.feature'

export const snapshotFile1 = '__snapshots__/snapshot1.feature.snap'
export const snapshotFile1WithPropertyMatchers =
    '__snapshots__/snapshot1WithPropertyMatchers.feature.snap'
export const snapshotFile1NotExists = '__snapshots__/snapshot1NotExists.feature.snap'
export const snapshotFile1And2 = '__snapshots__/snapshot1And2.feature.snap'
export const snapshotFile1With2SnapshotsInAScenario =
    '__snapshots__/snapshot1With2SnapshotsInAScenario.feature.snap'
export const snapshotFile1With3SnapshotsInAScenario =
    '__snapshots__/snapshot1With3SnapshotsInAScenario.feature.snap'

export const snapshotFileMultilineString = '__snapshots__/snapshotMultilineString.feature.snap'
