const expressionRegex = /(?<field>[^\s]+)\s+(?<matcher>!?(?:[#~*^$]?=|\?))(?:\s+(?<value>.+))?/

export const parseMatchExpression = (expression) => {
    const results = expressionRegex.exec(expression)
    if (results) return results.groups
    throw new TypeError(`'${expression}' is not a valid expression`)
}
