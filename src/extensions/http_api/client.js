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
const BODY_TYPE_MULTIPART = 'form-data'

const verbsAcceptingBody = ['POST', 'PUT', 'DELETE']

/**
 * Http Api Client extension.
 *
 * @class
 */
class HttpApiClient {
    constructor() {
        // REQUEST INFORMATION
        this.body = null
        this.bodyType = null
        this.headers = null
        this.query = null
        this.cookies = []
        this.cookieJar = null
        this.followRedirect = true

        // RESPONSE INFORMATION
        this.response = null
        this.responseCookies = {}
    }

    /**
     * Resets the client.
     */
    reset() {
        this.body = null
        this.bodyType = null
        this.headers = null
        this.query = null

        this.cookies = []
        this.cookieJar = null
        this.followRedirect = true

        this.response = null
        this.responseCookies = {}
    }

    /**
     * Sets request json body.
     *
     * @param {Object} payload
     */
    setJsonBody(payload) {
        this.bodyType = BODY_TYPE_JSON
        this.body = payload
    }

    /**
     * Sets request form body.
     *
     * @param {Object} payload
     */
    setFormBody(payload) {
        this.bodyType = BODY_TYPE_FORM
        this.body = payload
    }

    /**
     * Sets Follow Redirect option.
     *
     */
    setFollowRedirect(isEnabled) {
        this.followRedirect = isEnabled
    }

    /**
     * Sets request body for multipart form data
     *
     * @param {Object} payload
     */
    setMultipartBody(payload) {
        this.bodyType = BODY_TYPE_MULTIPART
        this.body = payload
    }

    /**
     * Clears current request body
     */
    clearBody() {
        this.body = null
        this.bodyType = null
    }

    /**
     * Sets request query parameters.
     *
     * @param {Object} query
     */
    setQuery(query) {
        this.query = query
    }

    /**
     * Sets request headers.
     *
     * @param {Object} headers
     */
    setHeaders(headers) {
        this.headers = headers
    }

    /**
     * Sets a single request header.
     *
     * @param {string} key
     * @param {string} value
     */
    setHeader(key, value) {
        this.headers = this.headers || {}
        this.headers[key] = value
    }

    /**
     * Clears current request headers.
     */
    clearHeaders() {
        this.headers = null
    }

    /**
     * Enables cookie jar.
     */
    enableCookies() {
        if (this.cookieJar !== null) return

        this.cookieJar = request.jar()
        this.cookieJar._jar.rejectPublicSuffixes = false
    }

    /**
     * Disables cookie jar.
     */
    disableCookies() {
        this.cookieJar = null
    }

    /**
     * Sets a cookie.
     * It does not actually add the cookie to the cookie jar
     * because setting the cookie requires the request url,
     * which we only have when making the request.
     *
     * @param {string|Object} cookie - Cookie string or Object
     */
    setCookie(cookie) {
        if (!_.isPlainObject(cookie) && !_.isString(cookie)) {
            throw new TypeError(`"cookie" must be a string or a cookie object`)
        }

        this.enableCookies()
        this.cookies.push(cookie)
    }

    /**
     * Clears registered request cookies.
     * Be aware that it does not clear existing response cookies.
     */
    clearRequestCookies() {
        this.cookies = []
    }

    /**
     * Retrieves a cookie by its key.
     *
     * @param {string} key - Cookie key
     * @return {Object|null} The cookie object if any, or null
     */
    getCookie(key) {
        if (this.responseCookies === null) return null
        if (this.responseCookies[key] === undefined) return null

        return this.responseCookies[key]
    }

    /**
     * Returns current response cookies.
     *
     * @return {Object} current response cookies
     */
    getCookies() {
        return this.responseCookies
    }

    /**
     * Returns the latest collected response.
     */
    getResponse() {
        return this.response
    }

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
    makeRequest(method, path, baseUrl) {
        return new Promise((resolve, reject) => {
            const options = {
                baseUrl: baseUrl,
                uri: path,
                method,
                qs: this.query || {},
                headers: this.headers,
                jar: this.cookieJar,
                followRedirect: this.followRedirect
            }

            const fullUri = `${baseUrl}${path}`

            if (this.body !== null) {
                if (!verbsAcceptingBody.includes(method)) {
                    throw new Error(
                        `You can only provide a body for ${verbsAcceptingBody.join(
                            ', '
                        )} HTTP methods, found: ${method}`
                    )
                }

                if (this.bodyType === BODY_TYPE_JSON) {
                    options.json = true
                    options.body = this.body
                } else if (this.bodyType === BODY_TYPE_FORM) {
                    options.form = this.body
                } else if (this.bodyType == BODY_TYPE_MULTIPART) {
                    options.formData = this.body
                }
            }

            if (this.cookieJar !== null) {
                this.cookies.forEach(cookie => {
                    if (_.isPlainObject(cookie)) {
                        this.cookieJar.setCookie(new Cookie(cookie), fullUri)
                    } else if (_.isString(cookie)) {
                        this.cookieJar.setCookie(cookie, fullUri)
                    }
                })
            }

            request(options, (_error, _response, _body) => {
                if (_error) {
                    console.error(_error, options) // eslint-disable-line no-console
                    reject()
                }

                this.response = _response

                if (this.cookieJar !== null) {
                    this.responseCookies = {}
                    this.cookieJar.getCookies(fullUri).forEach(cookie => {
                        this.responseCookies[cookie.key] = cookie
                    })
                }

                resolve()
            })
        })
    }
}

/**
 * Create a new isolated http api client
 * @return {HttpApiClient}
 */
module.exports = function(...args) {
    return new HttpApiClient(...args)
}

/**
 * Http api client extension.
 * @type {HttpApiClient}
 */
module.exports.HttpApiClient = HttpApiClient
