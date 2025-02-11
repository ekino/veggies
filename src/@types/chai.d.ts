declare module 'chai' {
    global {
        export namespace Chai {
            interface Assertion {
                startWith(expected: string): void
                endWith(expected: string): void
            }
        }
    }
}
