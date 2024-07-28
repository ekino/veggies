'use strict'

const { dedent } = require('../../../../lib/cjs/extensions/snapshot/dedent.js')

test('dedent align to first character', () => {
    const test = dedent(`
        My text
          Another line
        Another line again
    `)

    const expected = 'My text\n  Another line\nAnother line again'
    expect(test).toEqual(expected)
})

test('dedent align to first """', () => {
    const test = dedent(`
        """
          My text
            Another line
         Another line again
        """ 
    `)

    const expected = '  My text\n    Another line\n Another line again'
    expect(test).toEqual(expected)
})

test('dedent align should also work with tabulation', () => {
    const test = dedent(`
        """
          \tMy text
            Another line
         Another line again
        """ 
    `)

    const expected = '  \tMy text\n    Another line\n Another line again'
    expect(test).toEqual(expected)
})

test('dedent should not edit content if less than lines', () => {
    const test = dedent(`
    `)

    const expected = '\n    '
    expect(test).toEqual(expected)
})

test('dedent align should ignore last and first lines', () => {
    const test = dedent(`Some first content
        My text
          Another line
        Another line again
    Some last content`)

    const expected = 'My text\n  Another line\nAnother line again'
    expect(test).toEqual(expected)
})

test('dedent align with """ should ignore two last and two first lines', () => {
    const test = dedent(`Some content
        """Some other content
          \tMy text
            Another line
         Another line again
        """ Some end content
    Some end other content`)

    const expected = '  \tMy text\n    Another line\n Another line again'
    expect(test).toEqual(expected)
})

test('dedent works without parenthesis', () => {
    const test = dedent`
        My text
          Another line
        Another line again
    `

    const expected = 'My text\n  Another line\nAnother line again'
    expect(test).toEqual(expected)
})
