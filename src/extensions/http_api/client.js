'use strict'

const request = require('request').defaults({ json: true })

const Cast = require('../../cast')

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'

// REQUEST INFORMATION
let body = null
let bodyType = null
let headers = null
let query = null

// RESPONSE INFORMATION
let response = null

exports.reset = () => {
    body = null
    bodyType = null
    headers = null
    query = null
    response = null
}

exports.setJsonBody = payload => {
    bodyType = BODY_TYPE_JSON
    body = Cast.object(payload)
}

exports.setFormBody = payload => {
    bodyType = BODY_TYPE_FORM
    body = payload
}

exports.setQuery = _query => {
    query = Cast.object(_query)
}

exports.setHeaders = _headers => {
    headers = Cast.object(_headers)
}

exports.setHeader = (key, value) => {
    headers = headers || {}
    headers[key] = Cast.value(value)
}

exports.getResponse = () => response

exports.makeRequest = (method, path, baseUrl) => {
    return new Promise((resolve, reject) => {
        const options = {
            baseUrl: baseUrl,
            uri: path,
            method,
            qs: query || {},
            headers
        }

        if (body !== null) {
            if (!['POST', 'PUT'].includes(method)) {
                throw new Error(`You can only provides a body for POST and PUT HTTP methods, found: ${method}`)
            }

            if (bodyType === BODY_TYPE_JSON) {
                options.json = true
                options.body = body
            } else if (bodyType === BODY_TYPE_FORM) {
                options.form = body
            }
        }

        request(options, (_error, _response, _body) => {
            if (_error) {
                console.error(_error, options) // eslint-disable-line no-console
                reject()
            }

            response = _response
            resolve()
        })
    })
}
