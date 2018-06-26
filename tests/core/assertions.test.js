'use strict'

const { countNestedProperties, assertObjectMatchSpec } = require('../../src/core/assertions')

beforeEach(() => {
    require('chai').clear()
})

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

    assertObjectMatchSpec({}, spec)
    expect(require('chai').expect).toHaveBeenCalledWith(undefined, `Property 'name' is undefined`)
    expect(require('chai').expect).toHaveBeenCalledWith(undefined, `Property 'gender' is undefined`)
})

test('check object property equals expected value', () => {
    const spec = [
        {
            field: 'name',
            matcher: 'equals',
            value: 'whatever'
        }
    ]

    assertObjectMatchSpec({ name: 'plouc' }, spec)
    expect(require('chai').expect).toHaveBeenCalledWith(
        'plouc',
        `Expected property 'name' to equal 'whatever', but found 'plouc'`
    )
})

test('check object property contains value', () => {
    const object = {
        first_name: 'Raphaël',
        last_name: 'Benitte'
    }
    const spec = [
        {
            field: 'first_name',
            matcher: 'contain',
            value: 'raph'
        },
        {
            field: 'last_name',
            matcher: 'contains',
            value: 'ben'
        }
    ]

    assertObjectMatchSpec(object, spec)
    expect(require('chai').expect).toHaveBeenCalledWith(
        'Raphaël',
        `Property 'first_name' (Raphaël) does not contain 'raph'`
    )
    expect(require('chai').expect).toHaveBeenCalledWith(
        'Benitte',
        `Property 'last_name' (Benitte) does not contain 'ben'`
    )
})

test('check object property matches regexp', () => {
    const object = {
        first_name: 'Raphaël',
        last_name: 'Benitte'
    }
    const spec = [
        {
            field: 'first_name',
            matcher: 'matches',
            value: 'raph'
        },
        {
            field: 'last_name',
            matcher: 'match',
            value: 'ben'
        }
    ]

    assertObjectMatchSpec(object, spec)
    expect(require('chai').expect).toHaveBeenCalledWith(
        'Raphaël',
        `Property 'first_name' (Raphaël) does not match 'raph'`
    )
    expect(require('chai').expect).toHaveBeenCalledWith(
        'Benitte',
        `Property 'last_name' (Benitte) does not match 'ben'`
    )
})

test('check object fully matches spec', () => {
    const object = {
        first_name: 'Raphaël',
        last_name: 'Benitte'
    }
    const spec = [
        {
            field: 'first_name',
            matcher: 'equal',
            value: 'Raphaël'
        },
        {
            field: 'last_name',
            matcher: 'match',
            value: 'ben'
        }
    ]

    assertObjectMatchSpec(object, spec, true)
    expect(require('chai').expect).toHaveBeenCalledWith(
        'Raphaël',
        `Expected property 'first_name' to equal 'Raphaël', but found 'Raphaël'`
    )
    expect(require('chai').expect).toHaveBeenCalledWith(
        'Benitte',
        `Property 'last_name' (Benitte) does not match 'ben'`
    )
    expect(require('chai').expect).toHaveBeenCalledWith(
        2,
        'Expected json response to fully match spec, but it does not'
    )
})
