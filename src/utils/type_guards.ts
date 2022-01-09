/* Custom type guards helping TS to infer types after filtering arrays
 *    const array: Array<number | undefined> = []
 *    const filteredArray = array.filter(n => !!n)  // filteredArray inferred as Array<number | undefined>
 *    const filteredArray = array.filter(isDefined) // filteredArray inferred as Array<number> =)
 */
export const isDefined = <T>(toTest: T | undefined | null): toTest is T => {
    return !!toTest
}
