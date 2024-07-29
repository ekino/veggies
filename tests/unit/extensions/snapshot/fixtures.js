const { dedent } = require('../../../../lib/cjs/extensions/snapshot/dedent.js')

exports.featureFileContent1 = dedent`
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

exports.snapshotContent1 = dedent`
    Object {
      "key1": "value1",
      "key2": "value2",
      "key3": "value3",
      "key4": "value4",
      "key5": "value5",
    }
`

exports.snapshotContent2 = dedent`
    Object {
      "key1": "value1",
      "key2": "value2",
      "key3": "value8",
      "key4": "value4",
      "key5": "value5",
    }
`

exports.snapshotContent3 = dedent`
    Object {
      "key1": "value1",
      "key2": "value2",
      "key3": "value9",
      "key4": "value4",
      "key5": "value5",
    }
`

exports.snapshotContent1WithPropertyMatchers = dedent`
    Object {
      "key1": "value1",
      "key2": "type(string)",
      "key3": "value3",
      "key4": "value4",
      "key5": "value5",
    }
`

exports.snapshotContentMultilineString = dedent`
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
`

exports.snapshotFileContent1 = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent1}\`;
`

exports.snapshotFileContent1WithPropertyMatchers = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent1WithPropertyMatchers}\`;
`

exports.snapshotFileContent1And2 = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent1}\`;

exports[\`scenario 2 1.1\`] = \`${exports.snapshotContent2}\`;
`

exports.snapshotFileContent1And2And3 = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent1}\`;

exports[\`scenario 1 2.1\`] = \`${exports.snapshotContent3}\`;

exports[\`scenario 2 1.1\`] = \`${exports.snapshotContent2}\`;
`

exports.snapshotFileContent1With2SnapshotsInAScenario = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent1}\`;

exports[\`scenario 1 1.2\`] = \`${exports.snapshotContent2}\`;
`

exports.snapshotFileContent1With3SnapshotsInAScenario = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent1}\`;

exports[\`scenario 1 1.2\`] = \`${exports.snapshotContent2}\`;

exports[\`scenario 1 1.3\`] = \`${exports.snapshotContent3}\`;
`

exports.snapshotFileContent1WithValue2 = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContent2}\`;
`

exports.snapshotFileContentMultilineString = `

exports[\`scenario 1 1.1\`] = \`${exports.snapshotContentMultilineString}\`;

`

exports.value1 = { key1: 'value1', key2: 'value2', key3: 'value3', key4: 'value4', key5: 'value5' }
exports.value1WithError = {
    key1: 'value1',
    key2: 2,
    key3: 'value3',
    key4: 'value4',
    key5: 'value5',
}
exports.value2 = { key1: 'value1', key2: 'value2', key3: 'value8', key4: 'value4', key5: 'value5' }
exports.value3 = { key1: 'value1', key2: 'value2', key3: 'value9', key4: 'value4', key5: 'value5' }
exports.multilineValue = {
    content: { text: 'i am a text', 'long text': 'I\r\n am \r\n a\r\n long\r\n text' },
}

exports.featureFile1 = './snapshot1.feature'
exports.featureFile1WithPropertyMatchers = './snapshot1WithPropertyMatchers.feature'
exports.featureFile1And2 = './snapshot1And2.feature'
exports.featureFile1NotExists = './snapshot1NotExists.feature'
exports.featureFile1With2SnapshotsInAScenario = './snapshot1With2SnapshotsInAScenario.feature'
exports.featureFile1With3SnapshotsInAScenario = './snapshot1With3SnapshotsInAScenario.feature'
exports.featureFileMultilineString = './snapshotMultilineString.feature'

exports.snapshotFile1 = '__snapshots__/snapshot1.feature.snap'
exports.snapshotFile1WithPropertyMatchers =
    '__snapshots__/snapshot1WithPropertyMatchers.feature.snap'
exports.snapshotFile1NotExists = '__snapshots__/snapshot1NotExists.feature.snap'
exports.snapshotFile1And2 = '__snapshots__/snapshot1And2.feature.snap'
exports.snapshotFile1With2SnapshotsInAScenario =
    '__snapshots__/snapshot1With2SnapshotsInAScenario.feature.snap'
exports.snapshotFile1With3SnapshotsInAScenario =
    '__snapshots__/snapshot1With3SnapshotsInAScenario.feature.snap'

exports.snapshotFileMultilineString = '__snapshots__/snapshotMultilineString.feature.snap'
