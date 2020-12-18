'use strict'

/**
 * @module Assertions
 */

const _ = require('lodash')
const { expect } = require('chai')
const moment = require('moment-timezone')
const Cast = require('./cast')

const negationRegex = `!|! |not |does not |doesn't |is not |isn't `
const matchRegex = new RegExp(`^(${negationRegex})?(match|matches)$`)
const containRegex = new RegExp(`^(${negationRegex})?(contain|contains)$`)
const presentRegex = new RegExp(`^(${negationRegex})?(defined|present)$`)
const equalRegex = new RegExp(`^(${negationRegex})?(equal|equals)$`)
const typeRegex = new RegExp(`^(${negationRegex})?(type)$`)
const relativeDateRegex = new RegExp(`^(${negationRegex})?(equalRelativeDate)$`)
const relativeDateValueRegex = /^(\+?\d|-?\d),([A-Za-z]+),([A-Za-z-]{2,5}),(.+)$/

const RuleName = Object.freeze({
    Match: Symbol('match'),
    Contain: Symbol('contain'),
    Present: Symbol('present'),
    Equal: Symbol('equal'),
    Type: Symbol('type'),
    RelativeDate: Symbol('relativeDate'),
})

/**
 * Acts as `Object.keys()`, but runs recursively,
 * another difference is that when one of the key refers to
 * a non-empty object, it's gonna be ignored.
 *
 * Keys for nested objects are prefixed with their parent key.
 *
 * Also note that this is not fully interoperable with `lodash.get`
 * for example as keys themselves can contain dots or special characters.
 *
 * @example
 * Assertions.objectKeysDeep({
 *     a: true,
 *     b: true,
 *     c: true,
 * })
 * // => ["a", "b", "c"]
 * Assertions.objectKeysDeep({
 *     a: true,
 *     b: true,
 *     c: {
 *         d: true,
 *         e: {},
 *         f: {
 *              g: true
 *          }
 *     },
 * })
 * // =>  ["a", "b", "c.d", "c.e", "c.f.g"] (c and c.f are ignored as non empty nested objects)
 *
 * @param {Object} object
 * @param {Array} [keysAccumulator = []]
 * @param {string} [parentPath = ""]
 * @return {Array}
 */
exports.objectKeysDeep = (object, keysAccumulator = [], parentPath = '') => {
    if (_.isPlainObject(object) || Array.isArray(object)) {
        Object.keys(object).forEach((key) => {
            if (
                !_.isEmpty(object[key]) &&
                (_.isPlainObject(object[key]) || Array.isArray(object[key]))
            ) {
                keysAccumulator = exports.objectKeysDeep(
                    object[key],
                    keysAccumulator,
                    `${parentPath}${key}.`
                )
            } else {
                keysAccumulator.push(`${parentPath}${key}`)
            }
        })
    }

    return keysAccumulator
}

/**
 * @typedef {object} ObjectFieldSpec
 * @property {string} field
 * @property {string} matcher
 * @property {string} value
 */

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
 *
 * @see ObjectFieldSpec
 *
 * @param {object}            object        - object to test
 * @param {ObjectFieldSpec[]} spec          - specification
 * @param {boolean}           [exact=false] - if `true`, specification must match all object's properties
 */
exports.assertObjectMatchSpec = (object, spec, exact = false) => {
    expect(_.isPlainObject(object), 'Expected json response to be a valid object, but it is not').to
        .be.true
    const specPath = new Set()
    spec.forEach(({ field, matcher, value }) => {
        const currentValue = _.get(object, field)
        const expectedValue = Cast.value(value)
        specPath.add(field)
        const rule = exports.getMatchingRule(matcher)

        switch (rule.name) {
            case RuleName.Match: {
                const baseExpect = expect(
                    currentValue,
                    `Property '${field}' (${currentValue}) ${
                        rule.isNegated ? 'matches' : 'does not match'
                    } '${expectedValue}'`
                )
                if (rule.isNegated) {
                    baseExpect.to.not.match(new RegExp(expectedValue))
                } else {
                    baseExpect.to.match(new RegExp(expectedValue))
                }
                break
            }
            case RuleName.Contain: {
                const baseExpect = expect(
                    currentValue,
                    `Property '${field}' (${currentValue}) ${
                        rule.isNegated ? 'contains' : 'does not contain'
                    } '${expectedValue}'`
                )
                if (rule.isNegated) {
                    baseExpect.to.not.contain(expectedValue)
                } else {
                    baseExpect.to.contain(expectedValue)
                }
                break
            }
            case RuleName.Present: {
                const baseExpect = expect(
                    currentValue,
                    `Property '${field}' is ${rule.isNegated ? 'defined' : 'undefined'}`
                )
                if (rule.isNegated) {
                    baseExpect.to.be.undefined
                } else {
                    baseExpect.to.not.be.undefined
                }
                break
            }
            case RuleName.RelativeDate: {
                const match = relativeDateValueRegex.exec(expectedValue)
                if (match === null) throw new Error('relative date arguments are invalid')
                const [, amount, unit, locale, format] = match
                const normalizedLocale = Intl.getCanonicalLocales(locale)[0]
                const expectedDate = moment()
                    .add(amount, unit)
                    .locale(normalizedLocale)
                    .format(format)
                const baseExpect = expect(
                    currentValue,
                    `Expected property '${field}' to ${
                        rule.isNegated ? 'not ' : ''
                    }equal '${expectedDate}', but found '${currentValue}'`
                )
                if (rule.isNegated) {
                    baseExpect.to.not.be.deep.equal(expectedDate)
                } else {
                    baseExpect.to.be.deep.equal(expectedDate)
                }
                break
            }
            case RuleName.Type: {
                const baseExpect = expect(
                    currentValue,
                    `Property '${field}' (${currentValue}) type is${
                        rule.isNegated ? '' : ' not'
                    } '${expectedValue}'`
                )
                if (rule.isNegated) {
                    baseExpect.to.not.be.a(expectedValue)
                } else {
                    baseExpect.to.be.a(expectedValue)
                }
                break
            }
            case RuleName.Equal: {
                const baseExpect = expect(
                    currentValue,
                    `Expected property '${field}' to${
                        rule.isNegated ? ' not' : ''
                    } equal '${value}', but found '${currentValue}'`
                )
                if (rule.isNegated) {
                    baseExpect.to.not.be.deep.equal(expectedValue)
                } else {
                    baseExpect.to.be.deep.equal(expectedValue)
                }
                break
            }
        }
    })

    // We check we have exactly the same number of properties as expected
    if (exact === true) {
        const objectKeys = exports.objectKeysDeep(object)
        const specObjectKeys = Array.from(specPath)
        expect(
            objectKeys,
            'Expected json response to fully match spec, but it does not'
        ).to.be.deep.equal(specObjectKeys)
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
 * @typedef {Object} Rule
 * @property {symbol} name - The name of the rule matched
 * @property {boolean} isNegated - Whether the matcher is negated or not
 * @param {string} matcher
 * @return {Rule} the result of the matching
 */
exports.getMatchingRule = (matcher) => {
    const matchGroups = matchRegex.exec(matcher)
    if (matchGroups) {
        return { name: RuleName.Match, isNegated: !!matchGroups[1] }
    }

    const containGroups = containRegex.exec(matcher)
    if (containGroups) {
        return { name: RuleName.Contain, isNegated: !!containGroups[1] }
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
        return {
            name: RuleName.RelativeDate,
            isNegated: !!relativeDateGroups[1],
        }
    }

    expect.fail(`Matcher "${matcher}" did not match any supported assertions`)
}
