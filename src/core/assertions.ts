import * as assert from 'node:assert/strict'
import type { MatchingRule, ObjectFieldSpec } from '../types.js'
import { getType, getValue, isEmpty, isNullish } from '../utils/index.js'
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
    for (const key in object) {
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

        const message = (msg: string) =>
            `Property '${field}' (${currentValue}) ${msg} '${expectedValue}'`

        switch (rule.name) {
            case RuleName.Match: {
                if (String(currentValue) === String(expectedValue)) {
                    rule.isNegated
                        ? assert.notEqual(currentValue, currentValue, message('matches'))
                        : assert.equal(currentValue, currentValue, message('does not match'))
                } else {
                    const regex = new RegExp(expectedValue)
                    rule.isNegated
                        ? assert.doesNotMatch(currentValue, regex, message('matches'))
                        : assert.match(currentValue, regex, message('does not match'))
                }
                break
            }
            case RuleName.Contain: {
                rule.isNegated
                    ? assert.ok(!currentValue.includes(expectedValue), message('contains'))
                    : assert.ok(currentValue.includes(expectedValue), message('does not contain'))
                break
            }
            case RuleName.StartWith: {
                rule.isNegated
                    ? assert.ok(!currentValue.startsWith(expectedValue), message('starts with'))
                    : assert.ok(
                          currentValue.startsWith(expectedValue),
                          message('does not start with')
                      )
                break
            }
            case RuleName.EndWith: {
                rule.isNegated
                    ? assert.ok(!currentValue.endsWith(expectedValue), message('ends with'))
                    : assert.ok(currentValue.endsWith(expectedValue), message('does not end with'))
                break
            }
            case RuleName.Present: {
                const messageErr = `Property '${field}' is ${rule.isNegated ? 'defined' : 'undefined'}`
                const value = isNullish(currentValue) ? 'defined' : 'undefined'
                rule.isNegated
                    ? assert.strictEqual(value, 'defined', messageErr)
                    : assert.strictEqual(value, 'undefined', messageErr)
                break
            }
            case RuleName.RelativeDate: {
                const match = relativeDateValueRegex.exec(expectedValue)
                if (isNullish(match)) throw new Error('relative date arguments are invalid')
                const [, amount, unit, locale, format] = match
                if (!locale || isNullish(amount) || !unit || !format) break

                const normalizedLocale = Intl.getCanonicalLocales(locale)[0]

                if (!normalizedLocale) break
                const now = new Date()
                const expectedDateObj = addTime(now, { unit, amount: Number(amount) })
                const expectedDate = formatTime(expectedDateObj, format, normalizedLocale)
                const messageErr = `Expected property '${field}' to ${
                    rule.isNegated ? 'not ' : ''
                }equal '${expectedDate}', but found '${currentValue}'`

                rule.isNegated
                    ? assert.notDeepStrictEqual(currentValue, expectedDate, messageErr)
                    : assert.deepStrictEqual(currentValue, expectedDate, messageErr)
                break
            }
            case RuleName.Type: {
                const messageErr = `Property '${field}' (${currentValue}) type is${
                    rule.isNegated ? '' : ' not'
                } '${expectedValue}'`

                const actualType = getType(currentValue)

                rule.isNegated
                    ? assert.notStrictEqual(actualType, expectedValue, messageErr)
                    : assert.strictEqual(actualType, expectedValue, messageErr)
                break
            }
            case RuleName.Equal: {
                const messageErr = `Expected property '${field}' to${
                    rule.isNegated ? ' not' : ''
                } equal '${value}', but found '${currentValue}'`

                rule.isNegated
                    ? assert.notDeepStrictEqual(currentValue, expectedValue, messageErr)
                    : assert.deepStrictEqual(currentValue, expectedValue, messageErr)
                break
            }
        }
    }

    // We check we have exactly the same number of properties as expected
    if (exact) {
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
    if (!matcher) return assert.fail(`Matcher "${matcher}" must be defined`)

    for (const { regex, name } of patterns) {
        const matchGroups = regex.exec(matcher)
        if (matchGroups) return { name, isNegated: !!matchGroups[1] }
    }

    return assert.fail(`Matcher "${matcher}" did not match any supported assertions`)
}

const patterns = [
    { regex: matchRegex, name: RuleName.Match },
    { regex: containRegex, name: RuleName.Contain },
    { regex: startWithRegex, name: RuleName.StartWith },
    { regex: endWithRegex, name: RuleName.EndWith },
    { regex: presentRegex, name: RuleName.Present },
    { regex: equalRegex, name: RuleName.Equal },
    { regex: typeRegex, name: RuleName.Type },
    { regex: relativeDateRegex, name: RuleName.RelativeDate },
]
