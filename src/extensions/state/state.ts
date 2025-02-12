import { CastedValue } from '../../core/cast.js'
import { setValue, getValue, template, isPlainObject, mapValues } from '../../utils/index.js'

type StateArgs = ConstructorParameters<typeof State>

class State {
    public state: Record<string, unknown>
    constructor() {
        this.state = {}
    }

    /**
     * Sets value for given key.
     */
    set(key: string, value: CastedValue): unknown {
        return setValue(this.state, key, value)
    }

    /**
     * Retrieves a value for given key.
     */
    get(key: string): unknown {
        return getValue(this.state, key)
    }

    /**
     * Clear the state
     */
    clear(): void {
        this.state = {}
    }

    /**
     * Dump state content
     * @return {Object|{}|*}
     */
    dump(): Record<string, unknown> {
        return this.state
    }

    populate(value: string): string {
        return template(value, { interpolate: /{{([\s\S]+?)}}/g })(this.state)
    }

    populateObject(object: Record<string, unknown>): Record<string, unknown> {
        return mapValues(object, (value) => {
            if (isPlainObject(value)) return this.populateObject(value)
            return this.populate(value as string)
        })
    }
}

/**
 * Create a new isolated state
 */
export default function (...args: StateArgs): State {
    return new State(...args)
}

/**
 * State extension.
 */
export { State }
