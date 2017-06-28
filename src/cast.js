'use strict'

const _ = require('lodash')

exports.value = value => {
    const matchResult = value.match(/^(.*)\(\((\w+)\)\)$/)
    let response = value

    if (matchResult) {
        switch (matchResult[2]) {
            case 'undefined':
                response = undefined
                break

            case 'null':
                response = null
                break

            case 'number':
                response = Number(matchResult[1])
                break

            case 'boolean':
                response = matchResult[1] === 'true'
                break

            case 'object':
                if (matchResult[1] === 'NULL' || matchResult[1] === 'null') {
                    response = null
                }
                if (matchResult[1] === 'undefined' || matchResult[1] === 'UNDEFINED') {
                    response = undefined
                }
                break

            case 'array':
                response = matchResult[1] ? matchResult[1].replace(/\s/g, '').split(',') : null
                break

            case 'date':
                if (matchResult[1] === 'today') {
                    response = new Date().toJSON().slice(0, 10)
                } else {
                    response = new Date(matchResult[1]).toJSON()
                }
                break

            case 'string':
            default:
                break
        }
    }

    return response
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
