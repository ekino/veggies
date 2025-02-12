import 'chai'

declare global {
    namespace Chai {
        interface Assertion {
            startWith(expected: string): Assertion
            endWith(expected: string): Assertion
        }
    }
}
