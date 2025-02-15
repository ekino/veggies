import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest'
import { assertObjectMatchSpec, countNestedProperties } from '../../../src/core/assertions.js'

beforeAll(() => {
    const MockDate = (lastDate) => () => new lastDate(2018, 4, 1)
    global.Date = vi.fn(MockDate(global.Date))
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
            c: true,
        })
    ).toBe(3)

    expect(
        countNestedProperties({
            a: true,
            b: true,
            c: true,
            d: {
                a: true,
                b: true,
            },
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
                e: 'value2',
            },
        })
    ).toBe(4)
})

test('should allow to count object properties with null, undefined properties ', () => {
    expect(
        countNestedProperties({
            a: null,
            b: undefined,
            c: 'value3',
        })
    ).toBe(3)
})

test('should allow to count object with properties array property', () => {
    expect(
        countNestedProperties({
            a: [1, 2],
            b: true,
            c: true,
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
                e: [],
            },
        })
    ).toBe(4)
})

test('object property is defined', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'defined',
        },
        {
            field: 'gender',
            matcher: 'present',
        },
        {
            field: 'age',
            matcher: '?',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ name: 'john', gender: 'male', age: 31 }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ name: 'john', gender: 'male' }, spec)).toThrow(
        `Property 'age' is undefined: expected undefined not to be undefined`
    )
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

test('object property is not defined', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'not defined',
        },
        {
            field: 'gender',
            matcher: 'not present',
        },
        {
            field: 'city',
            matcher: 'is not defined',
        },
        {
            field: 'street',
            matcher: `isn't defined`,
        },
        {
            field: 'age',
            matcher: `!?`,
        },
    ]

    expect(() => assertObjectMatchSpec({}, spec)).not.toThrow()
    expect(() => assertObjectMatchSpec({ name: 'john' }, spec)).toThrow(
        `Property 'name' is defined: expected 'john' to be undefined`
    )
    expect(() => assertObjectMatchSpec({ gender: 'john' }, spec)).toThrow(
        `Property 'gender' is defined: expected 'john' to be undefined`
    )
    expect(() => assertObjectMatchSpec({ city: 'paris' }, spec)).toThrow(
        `Property 'city' is defined: expected 'paris' to be undefined`
    )
    expect(() => assertObjectMatchSpec({ street: 'rue du chat qui pêche' }, spec)).toThrow(
        `Property 'street' is defined: expected 'rue du chat qui pêche' to be undefined`
    )
    expect(() => assertObjectMatchSpec({ age: 31 }, spec)).toThrow(
        `Property 'age' is defined: expected 31 to be undefined`
    )
    expect(() =>
        assertObjectMatchSpec(
            { name: 'john', gender: 'male', city: 'paris', street: 'rue du chat qui pêche' },
            spec
        )
    ).toThrow(`Property 'name' is defined: expected 'john' to be undefined`)
})

test('check object property equals expected value', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'equals',
            value: 'john',
        },
        {
            field: 'city',
            matcher: '=',
            value: 'Bordeaux',
        },
    ]

    expect(() => assertObjectMatchSpec({ name: 'john', city: 'Bordeaux' }, spec)).not.toThrow()
    expect(() => assertObjectMatchSpec({ name: 'plouc' }, spec)).toThrow(
        `Expected property 'name' to equal 'john', but found 'plouc': expected 'plouc' to deeply equal 'john'`
    )
    expect(() => assertObjectMatchSpec({ name: 'john', city: 'Paris' }, spec)).toThrow(
        `Expected property 'city' to equal 'Bordeaux', but found 'Paris': expected 'Paris' to deeply equal 'Bordeaux'`
    )
})

test('check object property does not equal expected value', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'does not equal',
            value: 'john',
        },
        {
            field: 'city',
            matcher: '!=',
            value: 'Paris',
        },
    ]

    expect(() => assertObjectMatchSpec({ name: 'plouc', city: 'Bordeaux' }, spec)).not.toThrow()
    expect(() => assertObjectMatchSpec({ name: 'plouc', city: 'Paris' }, spec)).toThrow(
        `Expected property 'city' to not equal 'Paris', but found 'Paris': expected 'Paris' to not deeply equal 'Paris`
    )
    expect(() => assertObjectMatchSpec({ name: 'john' }, spec)).toThrow(
        `Expected property 'name' to not equal 'john', but found 'john': expected 'john' to not deeply equal 'john`
    )
})

test('check object property contains value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'contain',
            value: 'john',
        },
        {
            field: 'last_name',
            matcher: 'contains',
            value: 'doe',
        },
        {
            field: 'city',
            matcher: '*=',
            value: 'ord',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doet', city: 'Bordeaux' }, spec)
    ).not.toThrow()
    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doe', city: 'Paris' }, spec)
    ).toThrow(`Property 'city' (Paris) does not contain 'ord': expected 'Paris' to include 'ord'`)
    expect(() => assertObjectMatchSpec({ first_name: 'john', last_name: 'john' }, spec)).toThrow(
        `Property 'last_name' (john) does not contain 'doe': expected 'john' to include 'doe'`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'doe', last_name: 'doe' }, spec)).toThrow(
        `Property 'first_name' (doe) does not contain 'john': expected 'doe' to include 'john'`
    )
})

test('check object property does not contain value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: `doesn't contain`,
            value: 'john',
        },
        {
            field: 'last_name',
            matcher: 'does not contain',
            value: 'doe',
        },
        {
            field: 'city',
            matcher: `doesn't contains`,
            value: 'york',
        },
        {
            field: 'street',
            matcher: 'does not contains',
            value: 'avenue',
        },
        {
            field: 'postal_code',
            matcher: '!*=',
            value: '44',
        },
    ]

    expect(() =>
        assertObjectMatchSpec(
            {
                first_name: 'foo',
                last_name: 'bar',
                city: 'miami',
                street: 'calle ocho',
                postal_code: 'FL 33135',
            },
            spec
        )
    ).not.toThrow()
    expect(() =>
        assertObjectMatchSpec(
            {
                first_name: 'foo',
                last_name: 'bar',
                city: 'miami',
                street: 'calle ocho',
                postal_code: 'FL 44135',
            },
            spec
        )
    ).toThrow(
        `Property 'postal_code' (FL 44135) contains '44': expected 'FL 44135' to not include '44'`
    )
    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'johnny', last_name: 'bar', city: 'miami', street: 'calle ocho' },
            spec
        )
    ).toThrow(
        `Property 'first_name' (johnny) contains 'john': expected 'johnny' to not include 'john'`
    )
    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'foo', last_name: 'doet', city: 'miami', street: 'calle ocho' },
            spec
        )
    ).toThrow(`Property 'last_name' (doet) contains 'doe': expected 'doet' to not include 'doe'`)
    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'foo', last_name: 'bar', city: 'new york', street: 'calle ocho' },
            spec
        )
    ).toThrow(
        `Property 'city' (new york) contains 'york': expected 'new york' to not include 'york'`
    )
    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'foo', last_name: 'bar', city: 'miami', street: 'krome avenue' },
            spec
        )
    ).toThrow(
        `Property 'street' (krome avenue) contains 'avenue': expected 'krome avenue' to not include 'avenue'`
    )
})

test('check object property starts with value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'starts with',
            value: 'john',
        },
        {
            field: 'last_name',
            matcher: '^=',
            value: 'do',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doe' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'john', last_name: 'john' }, spec)).toThrow(
        `Property 'last_name' (john) does not start with 'do': expected 'john' to start with 'do'`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'doe', last_name: 'doe' }, spec)).toThrow(
        `Property 'first_name' (doe) does not start with 'john': expected 'doe' to start with 'john'`
    )
})

test('check object property does not start with value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'does not start with',
            value: 'john',
        },
        {
            field: 'last_name',
            matcher: '!^=',
            value: 'do',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'bob', last_name: 'dylan' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'bod', last_name: 'doe' }, spec)).toThrow(
        `Property 'last_name' (doe) starts with 'do': expected 'doe' not to start with 'do'`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'johnny', last_name: 'dylan' }, spec)).toThrow(
        `Property 'first_name' (johnny) starts with 'john': expected 'johnny' not to start with 'john'`
    )
})

test('check object property ends with value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'ends with',
            value: 'ny',
        },
        {
            field: 'last_name',
            matcher: '$=',
            value: 'oe',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doe' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'johnny', last_name: 'john' }, spec)).toThrow(
        `Property 'last_name' (john) does not end with 'oe': expected 'john' to end with 'oe'`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'doe', last_name: 'doe' }, spec)).toThrow(
        `Property 'first_name' (doe) does not end with 'ny': expected 'doe' to end with 'ny'`
    )
})

test('check object property does not end with value', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'does not end with',
            value: 'ny',
        },
        {
            field: 'last_name',
            matcher: '!$=',
            value: 'oe',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'bob', last_name: 'dylan' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'bob', last_name: 'doe' }, spec)).toThrow(
        `Property 'last_name' (doe) ends with 'oe': expected 'doe' not to end with 'oe'`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'johnny', last_name: 'dylan' }, spec)).toThrow(
        `Property 'first_name' (johnny) ends with 'ny': expected 'johnny' not to end with 'ny'`
    )
})

test('check object property matches regexp', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'matches',
            value: '^john',
        },
        {
            field: 'last_name',
            matcher: 'match',
            value: '^doe',
        },
        {
            field: 'city',
            matcher: '~=',
            value: '(.+-){3}.+',
        },
    ]

    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'johnny', last_name: 'doet', city: 'Saint-Pée-sur-Nivelle' },
            spec
        )
    ).not.toThrow()
    expect(() =>
        assertObjectMatchSpec({ first_name: 'johnny', last_name: 'doet', city: 'Bordeaux' }, spec)
    ).toThrow(
        `Property 'city' (Bordeaux) does not match '(.+-){3}.+': expected 'Bordeaux' to match /(.+-){3}.+/`
    )
    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'johnny', last_name: 'john', city: 'Saint-Pée-sur-Nivelle' },
            spec
        )
    ).toThrow(`Property 'last_name' (john) does not match '^doe': expected 'john' to match /^doe/`)
    expect(() =>
        assertObjectMatchSpec(
            { first_name: 'doe', last_name: 'doe', city: 'Saint-Pée-sur-Nivelle' },
            spec
        )
    ).toThrow(`Property 'first_name' (doe) does not match '^john': expected 'doe' to match /^john/`)
})

test('check object property does not match regexp', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: `doesn't match`,
            value: '^john',
        },
        {
            field: 'last_name',
            matcher: '!~=',
            value: '^[a-z]{3}$',
        },
    ]

    expect(() =>
        assertObjectMatchSpec({ first_name: 'bob', last_name: 'dylan' }, spec)
    ).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'bob', last_name: 'doe' }, spec)).toThrow(
        `Property 'last_name' (doe) matches '^[a-z]{3}$': expected 'doe' not to match /^[a-z]{3}$/`
    )
    expect(() => assertObjectMatchSpec({ first_name: 'john', last_name: 'doe' }, spec)).toThrow(
        `Property 'first_name' (john) matches '^john': expected 'john' not to match /^john/`
    )
})

test('check object fully matches spec', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'equal',
            value: 'john',
        },
        {
            field: 'last_name',
            matcher: 'match',
            value: '^doe',
        },
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
            value: 'string',
        },
        {
            field: 'last_name',
            matcher: '#=',
            value: 'string',
        },
        {
            field: 'age',
            matcher: 'type',
            value: 'number',
        },
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

test('check object property type does not match', () => {
    const spec = [
        {
            field: 'first_name',
            matcher: 'not type',
            value: 'string',
        },
        {
            field: 'first_name',
            matcher: '!#=',
            value: 'string',
        },
    ]

    expect(() => assertObjectMatchSpec({ first_name: true }, spec)).not.toThrow()
    expect(() => assertObjectMatchSpec({ first_name: 'john' }, spec)).toThrow(
        `Property 'first_name' (john) type is 'string': expected 'john' not to be a string`
    )
})

test("check object property equals 'equalRelativeDate' and format", () => {
    const object = {
        beginDate: '2018-04-30',
    }
    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '-1,days,fr,YYYY-MM-DD',
            },
        ])
    }).not.toThrow()

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '+2,days,fr,YYYY-MM-DD',
            },
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal '2018-05-03', but found '2018-04-30': expected '2018-04-30' to deeply equal '2018-05-03'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '-2,days,fr,YYYY-MM-DD',
            },
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal '2018-04-29', but found '2018-04-30': expected '2018-04-30' to deeply equal '2018-04-29'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: "-2,days,fr,[Aujourd'hui] YYYY-MM-DD hh[h]mm",
            },
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal 'Aujourd'hui 2018-04-29 12h00', but found '2018-04-30': expected '2018-04-30' to deeply equal 'Aujourd\\'hui 2018-04-29 12h00'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'equalRelativeDate',
                value: '-2,days,EN-ZS,YYYY-MM-DD',
            },
        ])
    }).toThrow(
        `Expected property 'beginDate' to equal '2018-04-29', but found '2018-04-30': expected '2018-04-30' to deeply equal '2018-04-29'`
    )
})

test("check object property equals does not 'equalRelativeDate' and format", () => {
    const object = {
        beginDate: '2018-04-30',
    }
    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'not equalRelativeDate',
                value: '-1,days,fr,YYYY-MM-DD',
            },
        ])
    }).toThrow(
        `Expected property 'beginDate' to not equal '2018-04-30', but found '2018-04-30': expected '2018-04-30' to not deeply equal '2018-04-30'`
    )

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'does not equalRelativeDate',
                value: '+2,days,fr,YYYY-MM-DD',
            },
        ])
    }).not.toThrow()

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: '!equalRelativeDate',
                value: '-2,days,fr,YYYY-MM-DD',
            },
        ])
    }).not.toThrow()

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: `doesn't equalRelativeDate`,
                value: "-2,days,fr,[Aujourd'hui] YYYY-MM-DD hh[h]mm",
            },
        ])
    }).not.toThrow()

    expect(() => {
        assertObjectMatchSpec(object, [
            {
                field: 'beginDate',
                matcher: 'not equalRelativeDate',
                value: '-2,days,EN-ZS,YYYY-MM-DD',
            },
        ])
    }).not.toThrow()
})

test('check dateOffset throw Exception given invalid locale set', () => {
    const object = {
        beginDate: '2018-05-04',
    }
    const spec = [
        {
            field: 'beginDate',
            matcher: 'equalRelativeDate',
            value: '1,days,EN_US,YYYY-MM-DD',
        },
    ]

    expect(() => assertObjectMatchSpec(object, spec)).toThrowError(
        'relative date arguments are invalid'
    )
})

test('check unsupported matcher should fail', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'unknown',
            value: 'john',
        },
    ]

    expect(() => assertObjectMatchSpec({ name: 'john' }, spec)).toThrow(
        `Matcher "unknown" did not match any supported assertions`
    )
})
