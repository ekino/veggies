declare module 'natural-compare' {
    function naturalCompare(a: string, b: string): -1 | 0 | 1
    function naturalCompare(a: number, b: number): -1 | 0 | 1
    export = naturalCompare
}
