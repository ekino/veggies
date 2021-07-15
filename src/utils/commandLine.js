module.exports.hasArg = (arg) => process.argv.includes(arg)

module.exports.hasOneArgOf = (args) =>
    Array.isArray(args) ? args.some((arg) => process.argv.includes(arg)) : false
