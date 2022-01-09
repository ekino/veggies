/**
 * @module extensions/snapshot/snapshot
 */

import _ from 'lodash'
import path from 'path'
import { diff as jestDiff } from 'jest-diff'
import naturalCompare from 'natural-compare'
import chalk from 'chalk'

import * as fileSystem from './file_system'
import { Scenario, SnapshotContents, SnapshotOptions } from './snapshot_types'

const EXPECTED_COLOR = chalk.green
const RECEIVED_COLOR = chalk.red
const JEST_NO_DIFF_MESSAGE = 'Compared values have no visual difference.'

export const scenarioRegex = /^[\s]*Scenario:[\s]*(.*[^\s])[\s]*$/
export const snapshotsContents: SnapshotContents = {}

/**
 * Extract scenarios from a feature file
 * @param {string} file - Feature file path
 * @return {Array<string>} - Scenarios names
 */
export const extractScenarios = (file?: string): Scenario[] => {
    if (!file) throw new TypeError(`Invalid feature file ${file}`)

    const content = fileSystem.getFileContent(file)
    const linesContent = _.split(content, '\n')

    const result: Scenario[] = []
    _.forEach(linesContent, (lineContent, idx) => {
        const line = idx + 1
        const scenarioInfos = scenarioRegex.exec(lineContent)
        if (scenarioInfos) result.push({ line, name: scenarioInfos[1] || '' })
    })

    return result
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
export const prefixSnapshots = (scenarios?: Scenario[]): Record<number, Scenario> => {
    if (!scenarios?.length) throw new Error(`Scenarios are required to prefix snapshots`)

    const nameCount: Record<string, number> = {}
    const result: Record<number, Scenario> = {}

    _.forEach(scenarios, (scenario: Scenario) => {
        nameCount[scenario.name] = nameCount[scenario.name] ?? 0
        nameCount[scenario.name]++

        const prefix = `${scenario.name} ${nameCount[scenario.name]}`

        result[scenario.line] = {
            name: scenario.name,
            line: scenario.line,
            prefix: prefix,
        }
    })

    return result
}

/**
 * Read a snapshot file and parse it.
 * For each feature file, we have one snapshot file
 * @param {string} file - snapshot file path
 * @return {Object} - Return follows the pattern : {snapshot_name: snapshot_content}
 */
export const readSnapshotFile = (file: string): SnapshotContents => {
    if (!file) throw new Error(`Missing snapshot file ${file} to read snapshots`)

    const info = fileSystem.getFileInfo(file)
    if (!info) return {}

    const content = fileSystem.getFileContent(file)

    return parseSnapshotFile(content)
}

/**
 * Format and write a snapshot file content
 * @param {string} file - file path
 * @param {Object} content - snapshot file content following the pattern : {snapshot_name: snapshot_content}
 */
export const writeSnapshotFile = (file: string, content: Record<string, string>): void => {
    const serializedContent = formatSnapshotFile(content)
    return fileSystem.writeFileContent(file, serializedContent)
}

/**
 * Get snapshot file path base on feature file path
 * @param {string} featureFile - Feature file path
 * @param {Object} opts
 * @param {Object} [opts.snapshotsDirname = '__snapshots__'] - Snapshots dirname
 * @param {Object} [opts.snapshotsFileExtension = 'snap'] - Snapshots files extension
 */
export const snapshotsPath = (featureFile: string, opts: SnapshotOptions): string => {
    const dirname = opts.snapshotsDirname || '__snapshots__'
    const dir = path.join(path.dirname(featureFile), dirname)
    const filename = `${path.basename(featureFile)}.${opts.snapshotsFileExtension || 'snap'}`

    return path.join(dir, filename)
}

/**
 * Compute diff between two contents.
 * If no diff, it returns undefined
 * @param {string} snapshot - snapshot content
 * @param {string} expected - expected content
 * @returns {string} Diff message
 */
export const diff = (snapshot: string, expected: string): string | null => {
    let diffMessage = jestDiff(snapshot, expected, {
        expand: false,
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
export const wrapWithBacktick = (str: string): string => {
    return '`' + str.replace(/`|\\|\${/g, '\\$&') + '`'
}

/**
 * Normalize new lines to be \n only
 * @param {string} str - Content to normalize
 */
export const normalizeNewlines = (str: string): string => {
    return str.replace(/\r\n|\r/g, '\n')
}

/**
 * For a snapshot file by add backticks and format it as js files with keys
 * @param {object} content - snapshots content
 * @return {string} formatted snapshot file
 */
export const formatSnapshotFile = (content: Record<string, string>): string => {
    const snapshots = Object.keys(content)
        .sort(naturalCompare)
        .map(
            (key) =>
                'exports[' +
                wrapWithBacktick(key) +
                '] = ' +
                wrapWithBacktick(normalizeNewlines(content[key] || '')) +
                ';'
        )
    return '\n\n' + snapshots.join('\n\n') + '\n'
}

/**
 * Extract keys / values from snapshot file
 * @param {string} content - Snapshot file content
 * @return {Object} - should follow the pattern {snapshot_name: snapshot_content}
 */
export const parseSnapshotFile = (content: string): SnapshotContents => {
    const data = {}
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const populate = new Function('exports', content)
    populate(data)

    return data
}
