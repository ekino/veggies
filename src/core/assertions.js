'use strict'

/**
 * @module Assertions
 */

const _ = require('lodash')
const { expect } = require('chai')

const Cast = require('./cast')

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
 * @property {string}                                                                      field
 * @property {'match'|'matches'|'contain'|'contains'|'defined'|'present'|'equal'|'equals'} matcher
 * @property {string}                                                                      value
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

        switch (matcher) {
            case 'match':
            case 'matches':
                expect(
                    currentValue,
                    `Property '${field}' (${currentValue}) does not match '${expectedValue}'`
                ).to.match(new RegExp(expectedValue))
                break

            case 'contain':
            case 'contains':
                expect(
                    currentValue,
                    `Property '${field}' (${currentValue}) does not contain '${expectedValue}'`
                ).to.contain(expectedValue)
                break

            case 'defined':
            case 'present':
                expect(currentValue, `Property '${field}' is undefined`).to.not.be.undefined
                break

            case 'type':
                expect(
                    currentValue,
                    `Property '${field}' (${currentValue}) type is not '${expectedValue}'`
                ).to.be.a(expectedValue)
                break

            case 'equal':
            case 'equals':
            default:
                expect(
                    currentValue,
                    `Expected property '${field}' to equal '${value}', but found '${currentValue}'`
                ).to.be.deep.equal(expectedValue)
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
