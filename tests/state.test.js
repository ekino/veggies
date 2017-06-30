'use strict'

const state = require('../src/extensions/state/state')

test('should return null value', () => {
    expect(state.populate('((null))')).toBe('((null))')
})

test('should return undefined value', () => {
    expect(state.populate('((undefined))')).toBe('((undefined))')
})

test('should populate value with state data', () => {
    state.clear()
    state.set('key1', '1')
    expect(state.populate('{{key1}}')).toBe('1')
    expect(state.populate('{{key1}}((number))')).toBe('1((number))')
})

test('should returned complete object populated with the state data', () => {
    state.clear()
    state.set('key1', 'value1')
    state.set('key2', '2')

    const object = {
        field1: '{{key1}}',
        object2: {
            field1: '1((number))',
            field2: '{{key2}}((number))'
        }
    }

    const expectedObject = {
        field1: 'value1',
        object2: {
            field1: '1((number))',
            field2: '2((number))'
        }
    }

    expect(state.populateObject(object)).toEqual(expectedObject)
})
