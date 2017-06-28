'use strict'

/**
 * The http client used by the http API extension.
 *
 * @module extensions/httpApi/client
 */

const request = require('request').defaults({ json: true })

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'

// REQUEST INFORMATION
let body = null
let bodyType = null
let headers = null
let query = null

// RESPONSE INFORMATION
let response = null

/**
 * Resets the client.
 */
exports.reset = () => {
    body = null
    bodyType = null
    headers = null
    query = null
    response = null
}

/**
 * Sets request json body.
 *
 * @param {Object} payload
 */
exports.setJsonBody = payload => {
    bodyType = BODY_TYPE_JSON
    body = payload
}

/**
 * Sets request form body.
 *
 * @param {Object} payload
 */
exports.setFormBody = payload => {
    bodyType = BODY_TYPE_FORM
    body = payload
}

/**
 * Sets request query parameters.
 *
 * @param {Object} _query
 */
exports.setQuery = _query => {
    query = _query
}

/**
 * Sets request headers.
 *
 * @param {Object} _headers
 */
exports.setHeaders = _headers => {
    headers = _headers
}

/**
 * Sets a single request header.
 *
 * @param {string} key
 * @param {string} value
 */
exports.setHeader = (key, value) => {
    headers = headers || {}
    headers[key] = value
}

/**
 * Returns the latest collected response.
 */
exports.getResponse = () => response

/**
 * Performs a request using all previously defined paramaters:
 * - headers
 * - query
 * - body
 *
 * @param {string} method    - The http verb
 * @param {string} path      - The path
 * @param {string} [baseUrl] - The base url
 */
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
