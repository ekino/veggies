const format =
    (open: number, close = 39) =>
    (input: string) =>
        `\x1b[${open}m` + input + `\x1b[${close}m`

const createColors = () => ({
    green: format(32),
    red: format(31),
    yellow: format(33),
})

export const colors = createColors()
