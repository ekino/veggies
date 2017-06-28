'use strict'

const _ = require('lodash')

exports.value = value => {
    const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/)
    let casted = value

    if (matchResult) {
        const type = matchResult[2]

        switch (type) {
            case 'undefined':
                casted = undefined
                break

            case 'null':
                casted = null
                break

            case 'number':
                casted = Number(matchResult[1])
                if (_.isNaN(casted)) {
                    throw new TypeError(`Unable to cast value to number '${value}'`)
                }
                break

            case 'boolean':
                casted = matchResult[1] === 'true'
                break

            case 'array':
                casted = matchResult[1] ? matchResult[1].replace(/\s/g, '').split(',').map(exports.value) : []
                break

            case 'date':
                if (matchResult[1] === 'today') {
                    casted = new Date().toJSON().slice(0, 10)
                } else {
                    casted = new Date(matchResult[1]).toJSON()
                }
                break

            case 'string':
                break

            default:
                throw new TypeError(`Invalid type provided: ${type} '${value}'`)
                break
        }
    }

    return casted
}

exports.object = object => {
    const castedObject = {}
    Object.keys(object).forEach(key => {
        _.set(castedObject, key, exports.value(object[key]))
    })

    return castedObject
}

exports.objects = objects => objects.map(object => exports.object(object))

exports.array = array => array.map(value => exports.value(value))
