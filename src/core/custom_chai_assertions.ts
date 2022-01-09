import { Assertion } from 'chai'

export const registerChaiAssertion = (): void => {
    Assertion.addMethod('startWith', function (expected: string) {
        return this.assert(
            typeof this._obj === 'string' && this._obj.startsWith(expected),
            `expected #{this} to start with #{exp}`,
            `expected #{this} not to start with #{exp}`,
            expected
        )
    })
    Assertion.addMethod('endWith', function (expected: string) {
        return this.assert(
            typeof this._obj === 'string' && this._obj.endsWith(expected),
            `expected #{this} to end with #{exp}`,
            `expected #{this} not to end with #{exp}`,
            expected
        )
    })
}
