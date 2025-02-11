'use strict'

/**
 * The http client used by the http API extension.
 *
 * @module extensions/httpApi/client
 */

import { Cookie, CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import { isPlainObject, isString } from '../../utils/index.js'
import axios from 'axios'
import FormData from 'form-data'

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'
const BODY_TYPE_MULTIPART = 'form-data'

const verbsAcceptingBody = ['POST', 'PUT', 'DELETE', 'PATCH']

const axiosInstance = axios.create()
let cookieInstance

const getClient = (cookieJar) => {
    if (cookieJar) {
        if (!cookieInstance) {
            cookieInstance = wrapper(axios.create({ jar: cookieJar, withCredentials: true }))
        }
        return cookieInstance
    }
    return axiosInstance
}

/**
 * Http Api Client extension.
 *
 * @class
 */
class HttpApiClient {
    constructor() {
        // REQUEST INFORMATION
        this.body = null
        this.bodyType = BODY_TYPE_JSON
        this.headers = {}
        this.query = {}
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
        this.bodyType = BODY_TYPE_JSON
        this.headers = {}
        this.query = {}

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
        this.bodyType = BODY_TYPE_JSON
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
        this.headers = headers || {}
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
        if (this.cookieJar) return

        this.cookieJar = new CookieJar()
        this.cookieJar.rejectPublicSuffixes = false
        this.cookieJar.looseMode = true
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
        if (!isPlainObject(cookie) && !isString(cookie)) {
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
            if (/https?:\/\//.test(path)) {
                const url = new URL(path)
                path = path.replace(url.origin, '')
                baseUrl = url.origin
            }

            const fullUrl = `${baseUrl}${path}`
            const options = {
                method,
                url: fullUrl,
                headers: this.headers,
                params: this.query,
                maxRedirects: this.followRedirect ? 5 : 0,
                jar: this.cookieJar,
            }

            if (this.body) {
                if (!verbsAcceptingBody.includes(method)) {
                    throw new Error(
                        `Body is only allowed for ${verbsAcceptingBody.join(', ')} methods, found: ${method}`,
                    )
                }

                if (this.bodyType === BODY_TYPE_JSON) {
                    options.headers['Content-Type'] = 'application/json'
                    options.data = this.body
                } else if (this.bodyType === BODY_TYPE_FORM) {
                    options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
                    options.data = new URLSearchParams(this.body).toString()
                } else if (this.bodyType === BODY_TYPE_MULTIPART) {
                    const formData = new FormData()
                    Object.entries(this.body).forEach(([key, value]) => formData.append(key, value))
                    options.data = formData
                }
            }

            // Set initial cookie before make request
            if (this.cookieJar) {
                this.cookies.forEach((cookie) => {
                    if (isPlainObject(cookie)) {
                        this.cookieJar.setCookie(new Cookie(cookie), fullUrl)
                    } else if (isString(cookie)) {
                        this.cookieJar.setCookie(cookie, fullUrl)
                    }
                })
            }
            const client = getClient(this.cookieJar)

            client
                .request(options)
                .then((response) => {
                    this.response = response

                    if (this.cookieJar) {
                        this.responseCookies = {}
                        const setCookieHeaders = this.response.headers['set-cookie']
                        if (setCookieHeaders) {
                            setCookieHeaders.forEach((cookie) => {
                                this.cookieJar.setCookieSync(cookie, fullUrl)
                            })
                        }
                        this.cookieJar.getCookiesSync(fullUrl).forEach((cookie) => {
                            this.responseCookies[cookie.key] = cookie
                        })
                    }
                    resolve()
                })
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        console.error('Axios error:', {
                            message: error.message,
                            response: error.response
                                ? {
                                      status: error.response.status,
                                      data: error.response.data,
                                      headers: error.response.headers,
                                  }
                                : undefined,
                            stack: error.stack,
                        })
                    } else {
                        console.error('Unexpected error:', error)
                    }
                    reject()
                })
        })
    }
}

/**
 * Create a new isolated http api client
 * @return {HttpApiClient}
 */
export default function (...args) {
    return new HttpApiClient(...args)
}

/**
 * Http api client extension.
 * @type {HttpApiClient}
 */
export { HttpApiClient }
