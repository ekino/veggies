'use strict'

jest.mock('@cucumber/cucumber')
const _ = require('lodash')
const cucumber = require('@cucumber/cucumber')

/**
 * Tests a step definition against given string.
 *
 * @param {RegExp}         regex             - RegExp used to match the step definition
 * @param {string}         str               - String to test
 * @param {Array.<string>} [expectedArgs=[]] - Ordered expected arguments
 */
const defShouldMatch = (regex, str, expectedArgs = []) => {
    const matches = str.match(regex)

    expect(matches).not.toBeNull()
    expectedArgs.forEach((expectedArg, index) => {
        expect(matches[index + 1]).toBe(expectedArg)
    })
}

/**
 * Ensures a step definition does not match given string.
 *
 * @param {RegExp} regex - RegExp used to match the step definition
 * @param {string} str   - String to test
 */
const defShouldNotMatch = (regex, str) => {
    expect(str).not.toMatch(regex)
}

/**
 * Executes step definition logic.
 *
 * @param {Function} execFn      - Step definition logic
 * @param {Object}   thisContext - `this` context to emulate cucumber context
 * @param args
 */
const execDef = (execFn, thisContext, ...args) => execFn.bind(thisContext)(...args)

exports.getContext = () => {
    const registeredDefinitions = cucumber.defineStep.mock.calls.map((def) => ({
        matcher: def[0], // The step definition regex
        exec: _.partial(execDef, def[1]), // The step definition logic
        shouldMatch: _.partial(defShouldMatch, def[0]),
        shouldNotMatch: _.partial(defShouldNotMatch, def[0]),
    }))

    const matchers = registeredDefinitions.map(({ matcher }) => matcher.toString())

    return {
        definitions: registeredDefinitions,
        getDefinitionByMatcher: (pattern) => {
            const found = registeredDefinitions.filter(({ matcher }) =>
                matcher.toString().includes(pattern)
            )
            if (found.length === 0) {
                throw new TypeError(
                    `No definition found for pattern: '${pattern}', available definition matchers:\n  - ${matchers.join(
                        '\n  - '
                    )}`
                )
            }

            if (found.length > 1) {
                throw new TypeError(
                    `Pattern '${pattern}' is ambiguous, found ${
                        found.length
                    } definitions:\n  - ${found
                        .map(({ matcher }) => matcher.toString())
                        .join('\n  - ')}`
                )
            }

            return found[0]
        },
    }
}

exports.clearContext = () => {
    cucumber.defineStep.mockReset()
}
