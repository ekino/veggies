export const hasArg = (arg: string): boolean => process.argv.includes(arg)

export const hasOneArgOf = (args: string | string[]): boolean =>
    Array.isArray(args) ? args.some((arg) => process.argv.includes(arg)) : false
