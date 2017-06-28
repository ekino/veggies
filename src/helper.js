'use strict'

exports.countNestedProperties = object => {
    let propertiesCount = 0
    Object.keys(object).forEach(key => {
        if (object[key] != null && typeof object[key] === 'object') {
            const count = exports.countNestedProperties(object[key])
            propertiesCount += count
        } else {
            propertiesCount++
        }
    })

    return propertiesCount
}

exports.registerExtension = (world, extensionId) => {
    world._registredExtensions = world._registredExtensions || []
    world._registredExtensions.push(extensionId)
}

exports.hasExtension = (world, extensionId) => {
    if (!world._registredExtensions) return false
    if (!world._registredExtensions.includes(extensionId)) return false

    return true
}
