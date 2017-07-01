'use strict'

/**
 * @module extensions/fixtures/FixturesLoader
 */

const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const _ = require('lodash')

let fixturesDir = 'fixtures'
let featureUri = null

exports.configure = ({ fixturesDir: _fixturesDir = 'fixtures' } = {}) => {
    fixturesDir = _fixturesDir
}

exports.setFeatureUri = _featureUri => {
    featureUri = _featureUri
}

/**
 * Tries to load a fixture from current feature directory.
 * Will search for the following file extensions:
 * - yaml
 * - yml
 * - js
 * - json
 * - txt
 *
 * @param {string} fixture - Fixture file name without extension
 * @return {Promise.<Object|string>} Fixture content
 */
exports.load = fixture => {
    if (featureUri === null) return Promise.reject()

    const relativePath = path.relative(process.cwd(), path.dirname(featureUri))
    const pattern = `${relativePath}/${fixturesDir}/${fixture}.@(yaml|yml|js|json|txt)`

    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            const fixturesCount = files.length

            if (fixturesCount === 0) return reject(`No fixtures found for: ${fixture} (${pattern})`)
            if (fixturesCount > 1) {
                return reject(
                    [
                        `Found ${fixturesCount} matching fixture files, `,
                        `you should have only one matching '${fixture}':\n  `,
                        `- ${files.join('\n  - ')}`
                    ].join('')
                )
            }
        })
    })
}

/**
 * Resets fixtures loader.
 */
exports.reset = () => {
    featureUri = null
}
