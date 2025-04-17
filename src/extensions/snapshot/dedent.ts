/**
 * Extract spaces length
 */
const getSpacesLength = (text?: string): number => {
    if (!text) return 0
    let length = 0

    while (length < text.length) {
        const char = text[length]
        if (char !== ' ' && char !== '\t') break
        length += 1
    }

    return length
}

/**
 * Used to remove indentation from a text. Usefull with multine string in backticks.
 *
 * Two way to use it : `
 *     My text
 *       Another line
 *     Another line again
 * `
 * the result text will be :
 * "My text
 *   Another line
 * Another line again"
 *
 * In this case, alignment is done on the length of the first character that is not a space or a tab of all lines
 *
 * Or
 *
 * Another way : `
 *     """
 *       My text
 *         Another line
 *      Another line again
 *     """
 * `
 * the result text will be :
 * "  My text
 *      Another line
 *  Another line again"
 *
 *  In this case, alignment is done on the spaces or tab before """
 *
 * Warning : First line and last line will always be ignored
 */
export const dedent = (inputText: string | string[] | TemplateStringsArray): string => {
    const text = typeof inputText === 'string' ? inputText : inputText[0] || ''

    let lines = text.split('\n')
    if (lines.length < 3) return text

    lines = lines.slice(1, lines.length - 1)

    let skipLength = getSpacesLength(lines[0])

    if (
        lines[0]?.substring(skipLength, skipLength + 3) === '"""' &&
        lines[lines.length - 1]?.substring(skipLength, skipLength + 3) === '"""'
    ) {
        lines = lines.slice(1, lines.length - 1)
    } else {
        skipLength = Math.min(...lines.map(getSpacesLength))
    }

    return lines.map((line) => line.substring(skipLength)).join('\n')
}

export default dedent
