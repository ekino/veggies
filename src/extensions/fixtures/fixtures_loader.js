'use strict'

/**
 * @module extensions/fixtures/FixturesLoader
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const yaml = require('js-yaml')
const _ = require('lodash')

let fixturesDir = 'fixtures'
let featureUri = null

exports.configure = ({ fixturesDir: _fixturesDir = 'fixtures' } = {}) => {
    fixturesDir = _fixturesDir
}

exports.setFeatureUri = _featureUri => {
    featureUri = _featureUri
}

const loadText = file =>
    new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject(err)
            resolve(data.toString('utf8'))
        })
    })

const loadYaml = file =>
    loadText(file).then(content => {
        try {
            const data = yaml.safeLoad(content)
            if (data === undefined) {
                return Promise.reject(new Error(`yaml parsing resulted in undefined data (${file})`))
            }

            return data
        } catch (err) {
            return Promise.reject(err)
        }
    })

const loadJson = file => Promise.resolve()

const loadModule = file => Promise.resolve()

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

            const fixtureFile = files[0]
            const ext = path.extname(fixtureFile).substr(1)

            switch (ext) {
                case 'yml':
                case 'yaml':
                    return resolve(loadYaml(fixtureFile))

                case 'js':
                    return resolve(loadModule(fixtureFile))

                case 'json':
                    return resolve(loadJson(fixtureFile))

                default:
                    return resolve(loadText(fixtureFile))
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
