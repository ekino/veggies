/**
 * @module extensions/state/State
 */

import _ from 'lodash'
import { CastedValue } from '../../core/core_types'

/**
 * State extension.
 *
 * @class
 */
export class State {
    public collections: Record<string, unknown>

    constructor() {
        this.collections = {}
    }

    /**
     * Sets value for given key.
     *
     * @param {string} key   - The key you wish to set a value for
     * @param {*}      value - The value
     */
    set(key: string, value?: CastedValue): void {
        _.set(this.collections, key, value)
    }

    /**
     * Retrieves a value for given key.
     *
     * @param {string} key - The key you wish to retrieve a value for
     * @return {*}
     */
    get(key: string): unknown {
        return _.get(this.collections, key)
    }

    /**
     * Clear the state
     */
    clear(): void {
        this.collections = {}
    }

    /**
     * Dump state content
     * @return {Object|{}|*}
     */
    dump(): Record<string, unknown> {
        return this.collections
    }

    populate(value: string): string {
        return _.template(value, { interpolate: /{{([\s\S]+?)}}/g })(this.collections)
    }

    populateObject(object: Record<string, string>): Record<string, string> {
        return _.mapValues(object, (value) => this.populate(value))
    }
}

export const state = new State()
