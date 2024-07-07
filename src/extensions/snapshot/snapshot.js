'use strict'

/**
 * @module extensions/snapshot/snapshot
 */

const path = require('path')
const { diff } = require('jest-diff')
const naturalCompare = require('natural-compare')
const chalk = require('chalk')

const fileSystem = require('./fs')

const EXPECTED_COLOR = chalk.green
const RECEIVED_COLOR = chalk.red
const JEST_NO_DIFF_MESSAGE = 'Compared values have no visual difference.'

exports.scenarioRegex = /^[\s]*Scenario:[\s]*(.*[^\s])[\s]*$/

/**
 * Extract scenarios from a feature file
 * @param {string} file - Feature file path
 * @return {Array<string>} - Scenarios names
 */
exports.extractScenarios = (file) => {
    if (!file) {
        throw new TypeError(`Invalid feature file ${file}`)
    }

    const content = fileSystem.getFileContent(file)
    const linesContent = content.split('\n')

    return linesContent
        .map((lineContent, idx) => {
            const line = idx + 1
            const scenarioInfos = this.scenarioRegex.exec(lineContent)
            if (scenarioInfos) {
                return { line, name: scenarioInfos[1] }
            }
            return undefined
        })
        .filter((item) => !!item)
}

/**
 * Create snapshots prefix that will be used for each snapshot step of a scenario
 * For example if the scenario name is 'Scenario 1', then prefix will be 'Scenario 1 1'
 * If then we have in the same file another scenario named 'Scenario 1', it's prefix will be 'Scenario 1 2' to avoid
 * naming collisions
 *
 * Result will follow the pattern :
 * {
 *   scenario_line: {
 *      name: scenario_name,
 *      line: scenario_line,
 *      prefix: scenario_snapshots_prefix
 *   },
 *   scenario2_line: {
 *      name: scenario2_name,
 *      line: scenario2_line,
 *      prefix: scenario2_snapshots_prefix
 *   }
 *   ...
 * }
 *
 * @param {Array<string>} scenarios - Scenarios names
 * @return {Object} - Read above for result format
 */
exports.prefixSnapshots = (scenarios) => {
    if (!scenarios) {
        throw new Error(`Scenarios are required to prefix snapshots`)
    }

    const nameCount = new Map()
    return scenarios.reduce((acc, scenario) => {
        const count = nameCount.get(scenario.name) || 0
        nameCount.set(scenario.name, count + 1)

        const prefix = `${scenario.name} ${count + 1}`

        acc[scenario.line] = { name: scenario.name, line: scenario.line, prefix: prefix }
        return acc
    }, {})
}

/**
 * Read a snapshot file and parse it.
 * For each feature file, we have one snapshot file
 * @param {string} file - snapshot file path
 * @return {Object} - Return follows the pattern : {snapshot_name: snapshot_content}
 */
exports.readSnapshotFile = (file) => {
    if (!file) {
        throw new Error(`Missing snapshot file ${file} to read snapshots`)
    }

    const info = fileSystem.getFileInfo(file)
    if (!info) return {}

    const content = fileSystem.getFileContent(file)

    return exports.parseSnapshotFile(content)
}

/**
 * Format and write a snapshot file content
 * @param {string} file - file path
 * @param {Object} content - snapshot file content following the pattern : {snapshot_name: snapshot_content}
 */
exports.writeSnapshotFile = (file, content) => {
    const serializedContent = exports.formatSnapshotFile(content)
    return fileSystem.writeFileContent(file, serializedContent)
}

/**
 * Get snapshot file path base on feature file path
 * @param {string} featureFile - Feature file path
 * @param {Object} opts
 * @param {Object} [opts.snaphotsDirname = '__snapshots__'] - Snapshots dirname
 * @param {Object} [opts.snapshotsFileExtension = 'snap'] - Snapshots files extension
 */
exports.snapshotsPath = (featureFile, opts) => {
    const dirname = opts.snaphotsDirname || '__snapshots__'
    const dir = path.join(path.dirname(featureFile), dirname)
    const filename = `${path.basename(featureFile)}.${opts.snapshotsFileExtension || 'snap'}`

    return path.join(dir, filename)
}

/**
 * Compute diff between two contents.
 * If no diff, it returns null
 * @param {string} snapshot - snapshot content
 * @param {string} expected - expected content
 * @returns {string} Diff message
 */
exports.diff = (snapshot, expected) => {
    let diffMessage = diff(snapshot, expected, {
        expand: false,
        colors: true,
        //contextLines: -1, // Forces to use default from Jest
        aAnnotation: 'Snapshot',
        bAnnotation: 'Received',
    })

    diffMessage =
        diffMessage ||
        `${EXPECTED_COLOR('- ' + (expected || ''))} \n ${RECEIVED_COLOR('+ ' + snapshot)}`
    if (diffMessage.indexOf(JEST_NO_DIFF_MESSAGE) !== -1) return null
    return `\n${diffMessage}`
}

/**
 * Add backticks to wrap snapshot content and replace backticks
 * @param {string} str - snapshot content
 * @return {string} wrapped content
 */
exports.wrapWithBacktick = (str) => {
    return '`' + str.replace(/`|\\|\${/g, '\\$&') + '`'
}

/**
 * Normalize new lines to be \n only
 * @param {string} string - Content to normalize
 */
exports.normalizeNewlines = (string) => {
    return string.replace(/\r\n|\r/g, '\n')
}

/**
 * For a snapshot file by add backticks and format it as js files with keys
 * @param {object} content - snapshots content
 * @return {string} formated snapshot file
 */
exports.formatSnapshotFile = (content) => {
    const snapshots = Object.keys(content)
        .sort(naturalCompare)
        .map(
            (key) =>
                'exports[' +
                exports.wrapWithBacktick(key) +
                '] = ' +
                exports.wrapWithBacktick(exports.normalizeNewlines(content[key])) +
                ';',
        )
    return '\n\n' + snapshots.join('\n\n') + '\n'
}

/**
 * Extract keys / values from snapshot file
 * @param {string} content - Snapshot file content
 * @return {Object} - should follow the pattern {snapshot_name: snapshot_content}
 */
exports.parseSnapshotFile = (content) => {
    const data = {}
    const populate = new Function('exports', content)
    populate(data)

    return data
}
