export const hasArg = (arg) => process.argv.includes(arg)

export const hasOneArgOf = (args) =>
    Array.isArray(args) ? args.some((arg) => process.argv.includes(arg)) : false
