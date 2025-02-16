import { describe, expect, it } from 'vitest'
import { dedent } from '../../../../src/extensions/snapshot/dedent.js'

describe('dedent', () => {
    it('aligns to first character', () => {
        const result = dedent(`
      My text
        Another line
      Another line again
    `)

        const expected = 'My text\n  Another line\nAnother line again'
        expect(result).toEqual(expected)
    })

    it('aligns to first """', () => {
        const result = dedent(`
      """
        My text
          Another line
       Another line again
      """ 
    `)

        const expected = '  My text\n    Another line\n Another line again'
        expect(result).toEqual(expected)
    })

    it('aligns with tabulation', () => {
        const result = dedent(`
      """
        \tMy text
          Another line
       Another line again
      """ 
    `)

        const expected = '  \tMy text\n    Another line\n Another line again'
        expect(result).toEqual(expected)
    })

    it('does not edit content if less than lines', () => {
        const result = dedent(`
    `)

        const expected = '\n    '
        expect(result).toEqual(expected)
    })

    it('ignores last and first lines', () => {
        const result = dedent(`Some first content
      My text
        Another line
      Another line again
    Some last content`)

        const expected = 'My text\n  Another line\nAnother line again'
        expect(result).toEqual(expected)
    })

    it('ignores two last and two first lines with """', () => {
        const result = dedent(`Some content
      """Some other content
        \tMy text
          Another line
       Another line again
      """ Some end content
    Some end other content`)

        const expected = '  \tMy text\n    Another line\n Another line again'
        expect(result).toEqual(expected)
    })

    it('works without parenthesis', () => {
        const result = dedent`
      My text
        Another line
      Another line again
    `

        const expected = 'My text\n  Another line\nAnother line again'
        expect(result).toEqual(expected)
    })
})
