import path from 'node:path'
import { diff as jestDiff } from 'jest-diff'
import naturalCompare from 'natural-compare'
import type { Scenario, SnapshotContent, SnapshotOptions } from '../../types.js'
import { GREEN, RED, RESET } from '../../utils/colors.js'
import * as fileSystem from './fs.js'

const JEST_NO_DIFF_MESSAGE = 'Compared values have no visual difference.'

export const scenarioRegex = /^[\s]*Scenario:[\s]*(.*[^\s])[\s]*$/

/**
 * Extract scenarios from a feature file
 */
export const extractScenarios = (file: string): Scenario[] => {
    if (!file) {
        throw new TypeError(`Invalid feature file ${file}`)
    }

    const content = fileSystem.getFileContent(file)
    const linesContent = content.split('\n')

    return linesContent
        .map((lineContent, idx) => {
            const line = idx + 1
            const scenarioInfos = scenarioRegex.exec(lineContent)
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
 */
export const prefixSnapshots = (scenarios?: Scenario[]): Record<number, Scenario> => {
    if (!scenarios) {
        throw new Error(`Scenarios are required to prefix snapshots`)
    }

    const nameCount = new Map()
    return scenarios.reduce((acc: Record<number, Scenario>, scenario) => {
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
 */
export const readSnapshotFile = (file: string): SnapshotContent => {
    if (!file) {
        throw new Error(`Missing snapshot file ${file} to read snapshots`)
    }

    const info = fileSystem.getFileInfo(file)
    if (!info) return {}

    const content = fileSystem.getFileContent(file)

    return parseSnapshotFile(content)
}

/**
 * Format and write a snapshot file content
 */
export const writeSnapshotFile = (file: string, content: SnapshotContent): void => {
    const serializedContent = formatSnapshotFile(content)
    fileSystem.writeFileContent(file, serializedContent)
}

/**
 * Get snapshot file path base on feature file path
 */
export const snapshotsPath = (featureFile: string, opts: SnapshotOptions): string => {
    const dirname = opts.snapshotsDirname || '__snapshots__'
    const dir = path.join(path.dirname(featureFile), dirname)
    const filename = `${path.basename(featureFile)}.${opts.snapshotsFileExtension || 'snap'}`

    return path.join(dir, filename)
}

/**
 * Compute diff between two contents.
 * If no diff, it returns null
 */
export const diff = (snapshot: string, expected: string): string | undefined => {
    let diffMessage = jestDiff(snapshot, expected, {
        expand: false,
        aAnnotation: 'Snapshot',
        bAnnotation: 'Received',
    })

    diffMessage =
        diffMessage || `${GREEN}- ${expected || ''}${RESET} \n ${RED}+ ${snapshot}${RESET}`
    if (diffMessage.indexOf(JEST_NO_DIFF_MESSAGE) !== -1) return undefined
    return `\n${diffMessage}`
}

/**
 * Add backticks to wrap snapshot content and replace backticks
 */
export const wrapWithBacktick = (str: string): string => {
    return '`' + str.replace(/`|\\|\${/g, '\\$&') + '`'
}

/**
 * Normalize new lines to be \n only
 */
export const normalizeNewlines = (string: string): string => {
    return string.replace(/\r\n|\r/g, '\n')
}

/**
 * For a snapshot file by add backticks and format it as js files with keys
 */
export const formatSnapshotFile = (content: SnapshotContent): string => {
    const snapshots = Object.keys(content)
        .sort(naturalCompare)
        .map(
            (key) =>
                'exports[' +
                wrapWithBacktick(key) +
                '] = ' +
                wrapWithBacktick(normalizeNewlines(content[key]?.toString() || '')) +
                ';'
        )
    return '\n\n' + snapshots.join('\n\n') + '\n'
}

/**
 * Extract keys / values from snapshot file
 */
export const parseSnapshotFile = (content: string): SnapshotContent => {
    const data = {}
    const populate = new Function('exports', content)
    populate(data)

    return data
}
