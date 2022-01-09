import _ from 'lodash'
import { defineStep } from '@cucumber/cucumber'

jest.mock('@cucumber/cucumber')
const defineStepMock = <jest.Mock<typeof defineStep>>defineStep

export interface DefinitionsHelper {
    defShouldMatch(regex: RegExp, str: string, expectedArgs: string[]): void
    defShouldNotMatch(regex: RegExp, str: string): void
}
export interface RegisteredDefinition {
    matcher: RegExp
    exec(thisContext: object, ...args: unknown[]): Awaited<unknown>
    shouldMatch(str: string, expectedArgs?: (string | undefined)[] | undefined): void
    shouldNotMatch(str: string): void
}
export interface DefinitionsHelperContext {
    definitions: RegisteredDefinition[]
    getDefinitionByMatcher(pattern: string): RegisteredDefinition
}

/**
 * Tests a step definition against given string.
 *
 * @param {RegExp}         regex             - RegExp used to match the step definition
 * @param {string}         str               - String to test
 * @param {Array.<string>} [expectedArgs=[]] - Ordered expected arguments
 */
const defShouldMatch = (regex: RegExp, str: string, expectedArgs: string[] = []): void => {
    const matches = str.match(regex)

    expect(matches).not.toBeNull()
    expectedArgs.forEach((expectedArg, index) => {
        expect(matches?.[index + 1]).toBe(expectedArg)
    })
}

/**
 * Ensures a step definition does not match given string.
 *
 * @param {RegExp} regex - RegExp used to match the step definition
 * @param {string} str   - String to test
 */
const defShouldNotMatch = (regex: RegExp, str: string): void => {
    expect(str).not.toMatch(regex)
}

/**
 * Executes step definition logic.
 *
 * @param {Function} execFn      - Step definition logic
 * @param {Object}   thisContext - `this` context to emulate cucumber context
 * @param args
 */
const execDef = (execFn: CallableFunction, thisContext: object, ...args: unknown[]): unknown => {
    return execFn.bind(thisContext)(...args)
}

export const getContext = (): DefinitionsHelperContext => {
    const registeredDefinitions: RegisteredDefinition[] = defineStepMock.mock.calls.map(
        (def: [RegExp, CallableFunction]) => ({
            matcher: def[0], // The step definition regex
            exec: _.partial(execDef, def[1]), // The step definition logic
            shouldMatch: _.partial(defShouldMatch, def[0]),
            shouldNotMatch: _.partial(defShouldNotMatch, def[0]),
        })
    )

    const matchers = registeredDefinitions.map(({ matcher }) => matcher?.toString())

    return {
        definitions: registeredDefinitions,
        getDefinitionByMatcher: (pattern: string): RegisteredDefinition => {
            const found = registeredDefinitions.filter(({ matcher }) =>
                matcher?.toString().includes(pattern)
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
                        .map(({ matcher }) => matcher?.toString())
                        .join('\n  - ')}`
                )
            }

            return found[0] as RegisteredDefinition
        },
    }
}

export const clearContext = (): void => {
    defineStepMock.mockReset()
}
