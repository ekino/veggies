import * as assert from 'node:assert/strict'
import type { MatchingRule, ObjectFieldSpec } from '../types.js'
import { getType, getValue, isEmpty, isNullsy } from '../utils/index.js'
import { addTime, formatTime } from '../utils/time.js'
import * as Cast from './cast.js'

const negationRegex = `!|! |not |does not |doesn't |is not |isn't `
const matchRegex = new RegExp(`^(${negationRegex})?(match|matches|~=)$`)
const containRegex = new RegExp(`^(${negationRegex})?(contains?|\\*=)$`)
const startWithRegex = new RegExp(`^(${negationRegex})?(starts? with|\\^=)$`)
const endWithRegex = new RegExp(`^(${negationRegex})?(ends? with|\\$=)$`)
const presentRegex = new RegExp(`^(${negationRegex})?(defined|present|\\?)$`)
const equalRegex = new RegExp(`^(${negationRegex})?(equals?|=)$`)
const typeRegex = new RegExp(`^(${negationRegex})?(type|#=)$`)
const relativeDateRegex = new RegExp(`^(${negationRegex})?(equalRelativeDate)$`)
const relativeDateValueRegex = /^(\+?\d|-?\d),([A-Za-z]+),([A-Za-z-]{2,5}),(.+)$/

const RuleName = Object.freeze({
    Match: Symbol('match'),
    Contain: Symbol('contain'),
    StartWith: Symbol('startWith'),
    EndWith: Symbol('endWith'),
    Present: Symbol('present'),
    Equal: Symbol('equal'),
    Type: Symbol('type'),
    RelativeDate: Symbol('relativeDate'),
})

/**
 * Count object properties including nested objects ones.
 * If a property is an object, its key is ignored.
 *
 * @example
 * Assertions.countNestedProperties({
 *     a: true,
 *     b: true,
 *     c: true,
 * })
 * // => 3
 * Assertions.countNestedProperties({
 *     a: true,
 *     b: true,
 *     c: {
 *         a: true,
 *         b: true,
 *     },
 * })
 * // => 4 (c is ignored because it's a nested object)
 */
export const countNestedProperties = (object: Record<string, unknown>): number => {
    let propertiesCount = 0
    for (const key of Object.keys(object)) {
        const val = object[key]
        if (!isEmpty(val) && typeof val === 'object') {
            const count = countNestedProperties(val as Record<string, unknown>)
            propertiesCount += count
        } else {
            propertiesCount++
        }
    }

    return propertiesCount
}

/**
 * Check that an object matches given specification.
 * specification must be defined as an array of ObjectFieldSpec.
 *
 * @example
 * Assertions.assertObjectMatchSpec(
 *     // object to check
 *     {
 *         first_name: 'Raoul',
 *         last_name: 'Marcel'
 *     },
 *     // spec
 *     [
 *         {
 *             field: 'first_name',
 *             matcher: 'equals',
 *             value: 'Raoul'
 *         },
 *         {
 *             field: 'last_name',
 *             matcher: 'equals',
 *             value: 'Dupond'
 *         },
 *     ]
 * )
 * // Will throw because last_name does not equal 'Dupond'.
 * [exact=false] - if `true`, specification must match all object's properties
 */

export const assertObjectMatchSpec = (
    object: Record<string, unknown>,
    spec: ObjectFieldSpec[],
    exact = false
): void => {
    for (const { field, matcher, value } of spec) {
        const currentValue = getValue(object, field) as string
        const expectedValue = Cast.getCastedValue(value) as string

        const rule = getMatchingRule(matcher)
        if (!rule) return

        let message: string
        switch (rule.name) {
            case RuleName.Match: {
                message = `Property '${field}' (${currentValue}) ${
                    rule.isNegated ? 'matches' : 'does not match'
                } '${expectedValue}'`
                const regex = new RegExp(expectedValue)

                if (rule.isNegated) {
                    assert.doesNotMatch(currentValue, regex, message)
                } else {
                    assert.match(currentValue, regex, message)
                }
                break
            }
            case RuleName.Contain: {
                message = `Property '${field}' (${currentValue}) ${
                    rule.isNegated ? 'contains' : 'does not contain'
                } '${expectedValue}'`

                if (rule.isNegated) {
                    assert.ok(!currentValue.includes(expectedValue), message)
                } else {
                    assert.ok(currentValue.includes(expectedValue), message)
                }
                break
            }
            case RuleName.StartWith: {
                message = `Property '${field}' (${currentValue}) ${
                    rule.isNegated ? 'starts with' : 'does not start with'
                } '${expectedValue}'`
                if (rule.isNegated) {
                    assert.ok(!currentValue.startsWith(expectedValue), message)
                } else {
                    assert.ok(currentValue.startsWith(expectedValue), message)
                }
                break
            }
            case RuleName.EndWith: {
                message = `Property '${field}' (${currentValue}) ${
                    rule.isNegated ? 'ends with' : 'does not end with'
                } '${expectedValue}'`
                if (rule.isNegated) {
                    assert.ok(!currentValue.endsWith(expectedValue), message)
                } else {
                    assert.ok(currentValue.endsWith(expectedValue), message)
                }
                break
            }
            case RuleName.Present: {
                message = `Property '${field}' is ${rule.isNegated ? 'defined' : 'undefined'}`
                const value = isNullsy(currentValue) ? 'defined' : 'undefined'
                if (rule.isNegated) {
                    assert.strictEqual(value, 'defined', message)
                } else {
                    assert.strictEqual(value, 'undefined', message)
                }
                break
            }
            case RuleName.RelativeDate: {
                const match = relativeDateValueRegex.exec(expectedValue)
                if (isNullsy(match)) throw new Error('relative date arguments are invalid')
                const [, amount, unit, locale, format] = match
                if (!locale || isNullsy(amount) || !unit || !format) break

                const normalizedLocale = Intl.getCanonicalLocales(locale)[0]

                if (!normalizedLocale) break
                const now = new Date()
                const expectedDateObj = addTime(now, { unit, amount: Number(amount) })
                const expectedDate = formatTime(expectedDateObj, format, normalizedLocale)
                message = `Expected property '${field}' to ${
                    rule.isNegated ? 'not ' : ''
                }equal '${expectedDate}', but found '${currentValue}'`

                if (rule.isNegated) {
                    assert.notDeepStrictEqual(currentValue, expectedDate, message)
                } else {
                    assert.deepStrictEqual(currentValue, expectedDate, message)
                }
                break
            }
            case RuleName.Type: {
                message = `Property '${field}' (${currentValue}) type is${
                    rule.isNegated ? '' : ' not'
                } '${expectedValue}'`

                const actualType = getType(currentValue)

                if (rule.isNegated) {
                    assert.notStrictEqual(actualType, expectedValue, message)
                } else {
                    assert.strictEqual(actualType, expectedValue, message)
                }
                break
            }
            case RuleName.Equal: {
                message = `Expected property '${field}' to${
                    rule.isNegated ? ' not' : ''
                } equal '${value}', but found '${currentValue}'`

                if (rule.isNegated) {
                    assert.notDeepStrictEqual(currentValue, expectedValue, message)
                } else {
                    assert.deepStrictEqual(currentValue, expectedValue, message)
                }
                break
            }
        }
    }

    // We check we have exactly the same number of properties as expected
    if (exact === true) {
        const propertiesCount = countNestedProperties(object)
        const message = 'Expected json response to fully match spec, but it does not'
        assert.strictEqual(propertiesCount, spec.length, message)
    }
}

/**
 * Get a rule matching the given matcher.
 * If it didn't match, it returns undefined.
 *
 * @example
 * Assertions.getMatchingRule(`doesn't match`)
 * // => { name: 'match', isNegated: true }
 * Assertions.getMatchingRule(`contains`)
 * // => { name: 'contain', isNegated: false }
 * Assertions.getMatchingRule(`unknown matcher`)
 * // => undefined
 */
export const getMatchingRule = (matcher?: string): MatchingRule | undefined => {
    if (!matcher) {
        return assert.fail(`Matcher "${matcher}" must be defined`)
    }

    const matchGroups = matchRegex.exec(matcher)
    if (matchGroups) {
        return { name: RuleName.Match, isNegated: !!matchGroups[1] }
    }

    const containGroups = containRegex.exec(matcher)
    if (containGroups) {
        return { name: RuleName.Contain, isNegated: !!containGroups[1] }
    }

    const startWithGroups = startWithRegex.exec(matcher)
    if (startWithGroups) {
        return { name: RuleName.StartWith, isNegated: !!startWithGroups[1] }
    }

    const endWithGroups = endWithRegex.exec(matcher)
    if (endWithGroups) {
        return { name: RuleName.EndWith, isNegated: !!endWithGroups[1] }
    }

    const presentGroups = presentRegex.exec(matcher)
    if (presentGroups) {
        return { name: RuleName.Present, isNegated: !!presentGroups[1] }
    }

    const equalGroups = equalRegex.exec(matcher)
    if (equalGroups) {
        return { name: RuleName.Equal, isNegated: !!equalGroups[1] }
    }

    const typeGroups = typeRegex.exec(matcher)
    if (typeGroups) {
        return { name: RuleName.Type, isNegated: !!typeGroups[1] }
    }

    const relativeDateGroups = relativeDateRegex.exec(matcher)
    if (relativeDateGroups) {
        return { name: RuleName.RelativeDate, isNegated: !!relativeDateGroups[1] }
    }

    return assert.fail(`Matcher "${matcher}" did not match any supported assertions`)
}
