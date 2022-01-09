import { MatchExpressionGroups } from './http_api_types'

const expressionRegex = /(?<field>[^\s]+)\s+(?<matcher>!?(?:[#~*^$]?=|\?))(?:\s+(?<value>.+))?/

export const parseMatchExpression = (expression?: string): MatchExpressionGroups | undefined => {
    const results = expression && expressionRegex.exec(expression)
    if (results) return results.groups

    throw new TypeError(`'${expression}' is not a valid expression`)
}
