'use strict'

/**
 * @module Assertions
 */

const _ = require('lodash')
const { expect } = require('chai')

const Cast = require('./cast')

const matchRegex = /match|matches$/
const containRegex = /contain|contains$/
const presentRegex = /defined|present$/
const equalRegex = /equal|equals$/
const typeRegex = /type$/
const negationRegex = /^!|not|does not|doesn't|is not|isn't/

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
 *
 * @param {Object} object
 * @return {number}
 */
exports.countNestedProperties = object => {
    let propertiesCount = 0
    Object.keys(object).forEach(key => {
        if (!_.isEmpty(object[key]) && typeof object[key] === 'object') {
            const count = exports.countNestedProperties(object[key])
            propertiesCount += count
        } else {
            propertiesCount++
        }
    })

    return propertiesCount
}

/**
 * @typedef {object} ObjectFieldSpec
 * @property {string} field
 * @property {'match'|'matches'|'does not match'|'contain'|'contains'|"doesn't contain"|'defined'|'is not defined'|'present'|"isn't present"|'equal'|'equals'|'does not equal'} matcher
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
    spec.forEach(({ field, matcher, value }) => {
        const currentValue = _.get(object, field)
        const expectedValue = Cast.value(value)

        const isNegated = negationRegex.exec(matcher) !== null

        if (matchRegex.exec(matcher) !== null) {
            const baseExpect = expect(
                currentValue,
                `Property '${field}' (${currentValue}) ${
                    isNegated ? 'matches' : 'does not match'
                } '${expectedValue}'`
            )
            if (isNegated) {
                baseExpect.to.not.match(new RegExp(expectedValue))
            } else {
                baseExpect.to.match(new RegExp(expectedValue))
            }
        }

        if (containRegex.exec(matcher) !== null) {
            const baseExpect = expect(
                currentValue,
                `Property '${field}' (${currentValue}) ${
                    isNegated ? 'contains' : 'does not contain'
                } '${expectedValue}'`
            )
            if (isNegated) {
                baseExpect.to.not.contain(expectedValue)
            } else {
                baseExpect.to.contain(expectedValue)
            }
        }

        if (presentRegex.exec(matcher) !== null) {
            const baseExpect = expect(
                currentValue,
                `Property '${field}' is ${isNegated ? 'defined' : 'undefined'}`
            )
            if (isNegated) {
                baseExpect.to.be.undefined
            } else {
                baseExpect.to.not.be.undefined
            }
        }

        if (typeRegex.exec(matcher) !== null) {
            const baseExpect = expect(
                currentValue,
                `Property '${field}' (${currentValue}) type is${
                    isNegated ? '' : ' not'
                } '${expectedValue}'`
            )
            if (isNegated) {
                baseExpect.to.not.be.a(expectedValue)
            } else {
                baseExpect.to.be.a(expectedValue)
            }
        }

        if (equalRegex.exec(matcher) !== null) {
            const baseExpect = expect(
                currentValue,
                `Expected property '${field}' to${
                    isNegated ? ' not' : ''
                } equal '${value}', but found '${currentValue}'`
            )
            if (isNegated) {
                baseExpect.to.not.be.deep.equal(expectedValue)
            } else {
                baseExpect.to.be.deep.equal(expectedValue)
            }
        }
    })

    // We check we have exactly the same number of properties as expected
    if (exact === true) {
        const propertiesCount = exports.countNestedProperties(object)
        expect(
            propertiesCount,
            'Expected json response to fully match spec, but it does not'
        ).to.be.equal(spec.length)
    }
}
