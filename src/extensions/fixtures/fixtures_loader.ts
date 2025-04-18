import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import fastGlob from 'fast-glob'
import yaml from 'js-yaml'
import { getError } from '../../utils/index.js'

export type FixturesArgs = ConstructorParameters<typeof FixturesLoader>

class FixturesLoader {
    public fixturesDir: string
    public featureUri?: string

    constructor({ fixturesDir } = { fixturesDir: 'fixtures' }) {
        this.fixturesDir = fixturesDir
        this.featureUri = undefined
    }

    /**
     * Configures the loader
     */
    configure({ fixturesDir } = { fixturesDir: 'fixtures' }): void {
        this.fixturesDir = fixturesDir
    }

    /**
     * Sets feature uri, used to resolve fixtures files.
     * When trying to load a fixture file the path will be comprised of:
     * - feature uri
     * - fixturesDir
     * - fixture name
     *
     */
    setFeatureUri(featureUri: string): void {
        this.featureUri = featureUri
    }

    /**
     * Loads content from file.
     */
    loadText(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) return reject(err)
                resolve(data.toString('utf8'))
            })
        })
    }

    /**
     * Loads content from yaml file.
     */
    async loadYaml(file: string): Promise<unknown> {
        return this.loadText(file).then((content) => {
            try {
                const data = yaml.load(content)
                if (!data) {
                    return Promise.reject(
                        new Error(
                            `Fixture file is invalid, yaml parsing resulted in undefined data for file: ${file}`
                        )
                    )
                }

                return data
            } catch (err) {
                return Promise.reject(
                    new Error(
                        `Unable to parse yaml fixture file: ${file}.\nerror: ${getError(err).message}`
                    )
                )
            }
        })
    }

    /**
     * Loads content from json file.
     */
    async loadJson(file: string): Promise<Record<string, unknown>> {
        return this.loadText(file).then((content) => {
            try {
                return JSON.parse(content)
            } catch (err) {
                return Promise.reject(
                    new Error(
                        `Unable to parse json fixture file: ${file}.\nerror: ${getError(err).message}`
                    )
                )
            }
        })
    }

    /**
     * Loads content from javascript module.
     */
    async loadModule(file: string): Promise<unknown> {
        const moduleURL = pathToFileURL(path.resolve(file)).href

        return import(moduleURL)
            .then((mod) => {
                if (typeof mod.default !== 'function') {
                    return Promise.reject(
                        new Error(
                            [
                                'JavaScript fixture file should export default function.\n',
                                `Make sure you declared 'export default function' in ${file}`,
                            ].join('')
                        )
                    )
                }

                return mod.default()
            })
            .catch((err) => {
                return Promise.reject(
                    new Error(
                        `An error occurred while loading fixture file: ${file}\nerror: ${getError(err).message}`
                    )
                )
            })
    }

    /**
     * Tries to load a fixture from current feature directory.
     * Will search for the following file extensions:
     * - yaml
     * - yml
     * - js
     * - json
     * - txt
     */
    async load(fixture: string): Promise<unknown> {
        if (!this.featureUri)
            return Promise.reject(
                new Error(`Cannot load fixture: ${fixture}, no feature uri defined`)
            )

        const featureDir = path.dirname(this.featureUri)
        const pattern = `${featureDir}/${this.fixturesDir}/${fixture}.@(yaml|yml|js|json|txt)`

        return new Promise((resolve, reject) => {
            const files = fastGlob.sync(pattern)
            const fixturesCount = files.length

            if (fixturesCount === 0)
                return reject(new Error(`No fixture found for: ${fixture} (${pattern})`))
            if (fixturesCount > 1) {
                return reject(
                    new Error(
                        [
                            `Found ${fixturesCount} matching fixture files, `,
                            `you should have only one matching '${fixture}', matches:\n  `,
                            `- ${files.join('\n  - ')}`,
                        ].join('')
                    )
                )
            }

            const fixtureFile = files[0] || ''
            const ext = path.extname(fixtureFile).substring(1)

            switch (ext) {
                case 'yml':
                case 'yaml':
                    return resolve(this.loadYaml(fixtureFile))

                case 'js':
                    return resolve(this.loadModule(fixtureFile))

                case 'json':
                    return resolve(this.loadJson(fixtureFile))

                default:
                    return resolve(this.loadText(fixtureFile))
            }
        })
    }

    /**
     * Resets fixtures loader.
     */
    reset() {
        this.featureUri = undefined
    }
}

/**
 * Create a new isolated fixtures loader
 */
export default function (...args: FixturesArgs): FixturesLoader {
    return new FixturesLoader(...args)
}

/**
 * fixtures loader extension.
 */
export { FixturesLoader as Fixture }
