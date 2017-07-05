'use strict'

/**
 * The http client used by the http API extension.
 *
 * @module extensions/httpApi/client
 */

const _ = require('lodash')
const request = require('request').defaults({ json: true })
const { Cookie } = require('tough-cookie')

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'

// REQUEST INFORMATION
let body = null
let bodyType = null
let headers = null
let query = null

let cookies = []
let cookieJar = null

// RESPONSE INFORMATION
let response = null
let responseCookies = null

/**
 * Resets the client.
 */
exports.reset = () => {
    body = null
    bodyType = null
    headers = null
    query = null

    cookies = []
    cookieJar = null

    response = null
    responseCookies = null
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
 * Clears current request body
 */
exports.clearBody = () => {
    body = null
    bodyType = null
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
 * Clears current request headers.
 */
exports.clearHeaders = () => {
    headers = null
}

/**
 * Enables cookie jar.
 */
exports.enableCookies = () => {
    if (cookieJar !== null) return

    cookieJar = request.jar()
    cookieJar._jar.rejectPublicSuffixes = false
}

/**
 * Disables cookie jar.
 */
exports.disableCookies = () => {
    cookieJar = null
}

/**
 * Sets a cookie.
 * It does not actually add the cookie to the cookie jar
 * because setting the cookie requires the request url,
 * which we only have when making the request.
 *
 * @param {string|Object} cookie - Cookie string or Object
 */
exports.setCookie = cookie => {
    if (!_.isPlainObject(cookie) && !_.isString(cookie)) {
        throw new TypeError(`"cookie" must be a string or a cookie object`)
    }

    exports.enableCookies()
    cookies.push(cookie)
}

/**
 * Retrieves a cookie by its key.
 *
 * @param {string} key - Cookie key
 * @return {Object|null} The cookie object if any, or null
 */
exports.getCookie = key => {
    if (responseCookies === null) return null
    if (responseCookies[key] === undefined) return null

    return responseCookies[key]
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
            headers,
            jar: cookieJar
        }

        const fullUri = `${baseUrl}${path}`

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

        if (cookieJar !== null) {
            cookies.forEach(cookie => {
                if (_.isPlainObject(cookie)) {
                    cookieJar.setCookie(new Cookie(cookie), fullUri)
                } else if (_.isString(cookie)) {
                    cookieJar.setCookie(cookie, fullUri)
                }
            })
        }

        request(options, (_error, _response, _body) => {
            if (_error) {
                console.error(_error, options) // eslint-disable-line no-console
                reject()
            }

            response = _response

            if (cookieJar !== null) {
                responseCookies = {}
                cookieJar.getCookies(fullUri).forEach(cookie => {
                    responseCookies[cookie.key] = cookie
                })
            }

            resolve()
        })
    })
}
