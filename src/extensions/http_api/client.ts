/**
 * The http client used by the http API extension.
 *
 * @module extensions/httpApi/client
 */

import _ from 'lodash'
import { Cookie } from 'tough-cookie'
import request, { CookieJar, Response } from 'request'
import { Headers, RequestOptions } from './http_api_types'
import Properties = Cookie.Properties
import { CastedValue } from '../../core/core_types'

request.defaults({ json: true })

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'
const BODY_TYPE_MULTIPART = 'form-data'

const verbsAcceptingBody = ['POST', 'PUT', 'DELETE', 'PATCH']

/**
 * Http Api Client extension.
 *
 * @class
 */
export class HttpApiClient {
    public body: object | null
    public bodyType: string | null
    public headers: Headers | null
    public query: object | null
    public cookies: Properties[]
    public cookieJar: CookieJar | null
    public followRedirect: boolean
    public response: Response | null
    public responseCookies: Record<string, Cookie>

    constructor() {
        this.reset()
    }

    /**
     * Resets the client.
     */
    reset(): void {
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
    setJsonBody(payload: object): void {
        this.bodyType = BODY_TYPE_JSON
        this.body = payload
    }

    /**
     * Sets request form body.
     *
     * @param {Object} payload
     */
    setFormBody(payload: object): void {
        this.bodyType = BODY_TYPE_FORM
        this.body = payload
    }

    /**
     * Sets Follow Redirect option.
     *
     */
    setFollowRedirect(isEnabled: boolean): void {
        this.followRedirect = isEnabled
    }

    /**
     * Sets request body for multipart form data
     *
     * @param {Object} payload
     */
    setMultipartBody(payload: object): void {
        this.bodyType = BODY_TYPE_MULTIPART
        this.body = payload
    }

    /**
     * Clears current request body
     */
    clearBody(): void {
        this.body = null
        this.bodyType = null
    }

    /**
     * Sets request query parameters.
     *
     * @param {Object} query
     */
    setQuery(query: object): void {
        this.query = query
    }

    /**
     * Sets request headers.
     *
     * @param {Object} headers
     */
    setHeaders(headers: Record<string, unknown>): void {
        this.headers = headers
    }

    /**
     * Sets a single request header.
     *
     * @param {string} key
     * @param {string} value
     */
    setHeader(key: string, value: CastedValue): void {
        this.headers = this.headers || {}
        this.headers[key] = value
    }

    /**
     * Clears current request headers.
     */
    clearHeaders(): void {
        this.headers = null
    }

    /**
     * Enables cookie jar.
     */
    enableCookies(): void {
        if (this.cookieJar !== null) return

        this.cookieJar = request.jar()
        // Property '_jar' does not exist on type 'CookieJar'.
        // this.cookieJar._jar.rejectPublicSuffixes = false
    }

    /**
     * Disables cookie jar.
     */
    disableCookies(): void {
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
    setCookie(cookie: Properties): void {
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
    clearRequestCookies(): void {
        this.cookies = []
    }

    /**
     * Retrieves a cookie by its key.
     *
     * @param {string} key - Cookie key
     * @return {Object|null} The cookie object if any, or null
     */
    getCookie(key: string): Cookie | undefined {
        if (this.responseCookies === null) return undefined
        if (this.responseCookies[key] === undefined) return undefined

        return this.responseCookies[key]
    }

    /**
     * Returns current response cookies.
     *
     * @return {Object} current response cookies
     */
    getCookies(): Record<string, Cookie> {
        return this.responseCookies
    }

    /**
     * Returns the latest collected response.
     */
    getResponse(): Response | null {
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
    makeRequest(method: string, path: string, baseUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const options: RequestOptions = {
                baseUrl: baseUrl,
                uri: path,
                method,
                qs: this.query || {},
                headers: this.headers || undefined,
                jar: this.cookieJar || undefined,
                followRedirect: this.followRedirect,
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
                this.cookies.forEach((cookie) => {
                    if (_.isPlainObject(cookie)) {
                        this.cookieJar?.setCookie(new Cookie(cookie), fullUri)
                    } else if (_.isString(cookie)) {
                        this.cookieJar?.setCookie(cookie, fullUri)
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
                    this.cookieJar.getCookies(fullUri).forEach((cookie) => {
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

export const httpApiClient = new HttpApiClient()
