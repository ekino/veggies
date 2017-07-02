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
let featureUri

/**
 * Configures the loader
 *
 * @param {string} _fixturesDir - The name of the fixtures directory relative to feature
 */
exports.configure = ({ fixturesDir: _fixturesDir = 'fixtures' } = {}) => {
    fixturesDir = _fixturesDir
}

/**
 * Sets feature uri, used to resolve fixtures files.
 * When trying to load a fixture file the path will be comprised of:
 * - feature uri
 * - fixturesDir
 * - fixture name
 *
 * @param {string} _featureUri - Feature uri
 */
exports.setFeatureUri = _featureUri => {
    featureUri = _featureUri
}

/**
 * Loads content from file.
 *
 * @param {string} file - File path
 * @return {Promise.<string>} File content
 */
exports.loadText = file =>
    new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject(err)
            resolve(data.toString('utf8'))
        })
    })

/**
 * Loads content from yaml file.
 *
 * @param {string} file - File path
 * @return {Promise.<Object|Array>} Parsed yaml data
 */
exports.loadYaml = file =>
    exports.loadText(file).then(content => {
        try {
            const data = yaml.safeLoad(content)
            if (data === undefined) {
                return Promise.reject(new Error(`Fixture file is invalid, yaml parsing resulted in undefined data for file: ${file}`))
            }

            return data
        } catch (err) {
            return Promise.reject(new Error(`Unable to parse yaml fixture file: ${file}.\nerror: ${err.message}`))
        }
    })

/**
 * Loads content from json file.
 *
 * @param {string} file - File path
 * @return {Promise.<Object>} Json data
 */
exports.loadJson = file =>
    exports.loadText(file).then(content => {
        try {
            const data = JSON.parse(content)

            return data
        } catch (err) {
            return Promise.reject(new Error(`Unable to parse json fixture file: ${file}.\nerror: ${err.message}`))
        }
    })

/**
 * Loads content from javascript module.
 *
 * @param {string} file - File path
 * @return {Promise.<*>} Data generated from the module
 */
exports.loadModule = file => {
    try {
        const relativePath = path.relative(__dirname, file)
        const mod = require(relativePath)

        if (!_.isFunction(mod)) {
            return Promise.reject(
                new Error(
                    [
                        `javascript fixture file should export default function.\n`,
                        `Make sure you declared 'module.exports = <function>' in ${file}`
                    ].join('')
                )
            )
        }

        return Promise.resolve(mod())
    } catch (err) {
        return Promise.reject(new Error(`An error occurred while loading fixture file: ${file}\nerror: ${err.message}`))
    }
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
    if (featureUri === undefined) return Promise.reject(new Error(`Cannot load fixture: ${fixture}, no feature uri defined`))

    const relativePath = path.relative(process.cwd(), path.dirname(featureUri))
    const pattern = `${relativePath}/${fixturesDir}/${fixture}.@(yaml|yml|js|json|txt)`

    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            const fixturesCount = files.length

            if (fixturesCount === 0) return reject(new Error(`No fixture found for: ${fixture} (${pattern})`))
            if (fixturesCount > 1) {
                return reject(
                    new Error(
                        [
                            `Found ${fixturesCount} matching fixture files, `,
                            `you should have only one matching '${fixture}':\n  `,
                            `- ${files.join('\n  - ')}`
                        ].join('')
                    )
                )
            }

            const fixtureFile = files[0]
            const ext = path.extname(fixtureFile).substr(1)

            switch (ext) {
                case 'yml':
                case 'yaml':
                    return resolve(exports.loadYaml(fixtureFile))

                case 'js':
                    return resolve(exports.loadModule(fixtureFile))

                case 'json':
                    return resolve(exports.loadJson(fixtureFile))

                default:
                    return resolve(exports.loadText(fixtureFile))
            }
        })
    })
}

/**
 * Resets fixtures loader.
 */
exports.reset = () => {
    featureUri = undefined
}
