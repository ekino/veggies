const { parseMatchExpression } = require('../../../src/extensions/http_api/utils')

test('parseMatchExpression should throw when expression is undefined', () => {
    expect(() => parseMatchExpression()).toThrow("'undefined' is not a valid expression")
})

test('parseMatchExpression should throw when expression does not match', () => {
    expect(() => parseMatchExpression('does not match')).toThrow(
        "'does not match' is not a valid expression",
    )
})

test('parseMatchExpression should return expected groups field, matcher, and value', () => {
    const expression = 'foo.bar[0] ~= ^(s+)$'

    const expectedResult = {
        field: 'foo.bar[0]',
        matcher: '~=',
        value: '^(s+)$',
    }

    const result = parseMatchExpression(expression)

    expect(result).toEqual(expectedResult)
})
