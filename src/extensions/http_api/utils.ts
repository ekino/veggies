const expressionRegex = /(?<field>[^\s]+)\s+(?<matcher>!?(?:[#~*^$]?=|\?))(?:\s+(?<value>.+))?/

export const parseMatchExpression = (expression: string): Record<string, string> | undefined => {
    const results = expressionRegex.exec(expression)
    if (results) return results.groups
    throw new TypeError(`'${expression}' is not a valid expression`)
}
