'use strict'

const { countNestedProperties, assertObjectMatchSpec } = require('../../src/core/assertions')

beforeAll(() => {
    const MockDate = lastDate => () => new lastDate(2018, 4, 1)
    global.Date = jest.fn(MockDate(global.Date))
})

afterAll(() => {
    global.Date.mockRestore()
})

beforeEach(() => {})

test('should allow to count object properties', () => {
    expect(
        countNestedProperties({
            a: true,
            b: true,
            c: true
        })
    ).toBe(3)

    expect(
        countNestedProperties({
            a: true,
            b: true,
            c: true,
            d: {
                a: true,
                b: true
            }
        })
    ).toBe(5)
})

test('should allow to count nested objects properties', () => {
    expect(
        countNestedProperties({
            a: true,
            b: true,
            c: {
                d: 'value1',
                e: 'value2'
            }
        })
    ).toBe(4)
})

test('should allow to count object properties with null, undefined properties ', () => {
    expect(
        countNestedProperties({
            a: null,
            b: undefined,
            c: 'value3'
        })
    ).toBe(3)
})

test('should allow to count object with properties array property', () => {
    expect(
        countNestedProperties({
            a: [1, 2],
            b: true,
            c: true
        })
    ).toBe(4)
})

test('should allow to count object properties with empty array property', () => {
    expect(
        countNestedProperties({
            a: true,
            b: true,
            c: {
                d: '',
                e: []
            }
        })
    ).toBe(4)
})

test('object property is defined', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'defined'
        },
        {
            field: 'gender',
            matcher: 'present'
        }
    ]

    expect(() => assertObjectMatchSpec({ name: 'john', gender: 'male' }, spec)).not.toThrow()
    expect(() => assertObjectMatchSpec({ name: 'john' }, spec)).toThrow(
        `Property 'gender' is undefined: expected undefined not to be undefined`
    )
    expect(() => assertObjectMatchSpec({ gender: 'john' }, spec)).toThrow(
        `Property 'name' is undefined: expected undefined not to be undefined`
    )
    expect(() => assertObjectMatchSpec({}, spec)).toThrow(
        `Property 'name' is undefined: expected undefined not to be undefined`
    )
})

test('check object property equals expected value', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'equals',
            value: 'john'
        }
    ]

    expect(() => assertObjectMatchSpec({ name: 'john' }, spec)).not.toThrow()
    expect(() => assertObjectMatchSpec({ name: 'plouc' }, spec)).toThrow(
        `Expected property 'name' to equal 'john', but found 'plouc': expected 'plouc' to deeply equal 'john'`
    )
})

test('check object property contains value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'contain',
            value: 'john'
        },
        {
            field: 'last_name',
            matcher: 'contains',
            value: 'doe'
        }
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doet' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'john', last_name: 'john' }, spec)).toThrow(
        `Property 'last_name' (john) does not contain 'doe': expected 'john' to include 'doe'`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'doe', last_name: 'doe' }, spec)).toThrow(
        `Property 'first_name' (doe) does not contain 'john': expected 'doe' to include 'john'`
    )
})

test('check object property matches regexp', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'matches',
            value: '^john'
        },
        {
            field: 'last_name',
            matcher: 'match',
            value: '^doe'
        }
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doet' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'john', last_name: 'john' }, spec)).toThrow(
        `Property 'last_name' (john) does not match '^doe': expected 'john' to match /^doe/`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'doe', last_name: 'doe' }, spec)).toThrow(
        `Property 'first_name' (doe) does not match '^john': expected 'doe' to match /^john/`
    )
})

test('check object fully matches spec', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'equal',
            value: 'john'
        },
        {
            field: 'last_name',
            matcher: 'match',
            value: '^doe'
        }
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'john', last_name: 'doet' }, spec, true)
    ).not.toThrow()
    expect(() =>
        assertObjectMatchSpec({ first_name: 'john', last_name: 'doet', gender: 'male' }, spec, true)
    ).toThrow(`Expected json response to fully match spec, but it does not: expected 3 to equal 2`)
    expect(() =>
        assertObjectMatchSpec({ first_name: 'john', last_name: 'john' }, spec, true)
    ).toThrow(`Property 'last_name' (john) does not match '^doe': expected 'john' to match /^doe/`)
    expect(() =>
        assertObjectMatchSpec({ first_name: 'doe', last_name: 'doe' }, spec, true)
    ).toThrow(
        `Expected property 'first_name' to equal 'john', but found 'doe': expected 'doe' to deeply equal 'john'`
    )
})

test('check object property type', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'type',
            value: 'string'
        },
        {
            field: 'last_name',
            matcher: 'type',
            value: 'string'
        },
        {
            field: 'age',
            matcher: 'type',
            value: 'number'
        }
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'john', last_name: 'doe', age: 23 }, spec)
    ).not.toThrow()
    expect(() =>
        assertObjectMatchSpec({ first_name: true, last_name: 'doe', age: 23 }, spec)
    ).toThrow(`Property 'first_name' (true) type is not 'string': expected true to be a string`)
    expect(() =>
        assertObjectMatchSpec({ first_name: 'john', last_name: 45, age: 'test' }, spec)
    ).toThrow(`Property 'last_name' (45) type is not 'string': expected 45 to be a string`)
    expect(() =>
        assertObjectMatchSpec({ first_name: 'john', last_name: 'doe', age: 'test' }, spec)
    ).toThrow(`Property 'age' (test) type is not 'number': expected 'test' to be a number`)
})

test("check object property equals 'equalRelativeDate' and format", () => {
    const object = {
        beginDate: '2018-04-30'
    }
    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '-1,days,fr,YYYY-MM-DD'
            }
        ])
    }).not.toThrow()

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '+2,days,fr,YYYY-MM-DD'
            }
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal '2018-05-03', but found '2018-04-30': expected '2018-04-30' to deeply equal '2018-05-03'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '-2,days,fr,YYYY-MM-DD'
            }
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal '2018-04-29', but found '2018-04-30': expected '2018-04-30' to deeply equal '2018-04-29'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: "-2,days,fr,[Aujourd'hui] YYYY-MM-DD hh[h]mm"
            }
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal 'Aujourd'hui 2018-04-29 12h00', but found '2018-04-30': expected '2018-04-30' to deeply equal 'Aujourd\\'hui 2018-04-29 12h00'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '-2,days,EN-ZS,YYYY-MM-DD'
            }
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal '2018-04-29', but found '2018-04-30': expected '2018-04-30' to deeply equal '2018-04-29'`
    )
})

test('check dateOffset throw Exception given invalid locale set', () => {
    const object = {
        beginDate: '2018-05-04'
    }
    const spec = [
        {
            field: 'beginDate',
            matcher: 'equalRelativeDate',
            value: '1,days,EN_US,YYYY-MM-DD'
        }
    ]

    expect(() => assertObjectMatchSpec(object, spec)).toThrowError(
        'relative date arguments are invalid'
    )
})
