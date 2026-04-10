import pathModule from 'node:path'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import FormData from 'form-data'
import { Cookie, CookieJar } from 'tough-cookie'
import type { CookieProperty, RequestBody, RequestHeaders, RequestOptions } from '../../types.js'
import { isPlainObject, isString } from '../../utils/index.js'

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'
const BODY_TYPE_MULTIPART = 'form-data'
const verbsAcceptingBody = ['POST', 'PUT', 'DELETE', 'PATCH']
const validateStatus = (status: number) => status >= 200 && status <= 302

// Proxy is disabled by default to ensure direct connections in test environments
// Set proxy: false explicitly to prevent axios from reading HTTP_PROXY env vars
const axiosInstance = axios.create({
    validateStatus,
    proxy: false,
})

const getClient = (cookieJar?: CookieJar, proxy = false): AxiosInstance => {
    if (cookieJar) {
        const cookieInstance = wrapper(
            axios.create({
                jar: cookieJar,
                withCredentials: true,
                validateStatus,
                // When proxy is true, use undefined to allow axios default behavior (reading env vars)
                // When proxy is false, explicitly disable to prevent proxy usage
                proxy: proxy ? undefined : false,
            })
        ) as AxiosInstance
        return cookieInstance
    }
    return axiosInstance
}

export type HttpApiClientArgs = ConstructorParameters<typeof HttpApiClient>

/**
 * Http Api Client extension.
 *
 * @class
 */
class HttpApiClient {
    public body: RequestBody | undefined
    public bodyType: string
    public headers: RequestHeaders
    public query: Record<string, unknown>
    public cookies: CookieProperty[]
    public cookieJar: CookieJar | undefined
    public followRedirect: boolean
    public response: AxiosResponse | undefined
    public responseCookies: Record<string, Cookie>
    public proxy: boolean

    constructor(proxy = false) {
        this.body = undefined
        this.bodyType = BODY_TYPE_JSON
        this.headers = {}
        this.query = {}
        this.cookies = []
        this.cookieJar = undefined
        this.followRedirect = true
        this.response = undefined
        this.responseCookies = {}
        this.proxy = proxy
    }

    /**
     * Resets the client.
     */
    reset(): void {
        this.body = undefined
        this.bodyType = BODY_TYPE_JSON
        this.headers = {}
        this.query = {}
        this.cookies = []
        this.cookieJar = undefined
        this.followRedirect = true
        this.response = undefined
        this.responseCookies = {}
    }

    /**
     * Sets request json body.
     */
    setJsonBody(payload: RequestBody): void {
        this.bodyType = BODY_TYPE_JSON
        this.body = payload
    }

    /**
     * Sets request form body.
     */
    setFormBody(payload: RequestBody): void {
        this.bodyType = BODY_TYPE_FORM
        this.body = payload
    }

    /**
     * Sets Follow Redirect option.
     */
    setFollowRedirect(isEnabled: boolean): void {
        this.followRedirect = isEnabled
    }

    /**
     * Sets request body for multipart form data
     */
    setMultipartBody(payload: RequestBody): void {
        this.bodyType = BODY_TYPE_MULTIPART
        this.body = payload
    }

    /**
     * Clears current request body
     */
    clearBody(): void {
        this.body = undefined
        this.bodyType = BODY_TYPE_JSON
    }

    /**
     * Sets request query parameters.
     */
    setQuery(query: Record<string, unknown>): void {
        this.query = query
    }

    /**
     * Sets request headers.
     */
    setHeaders(headers: RequestHeaders): void {
        this.headers = headers || {}
    }

    /**
     * Sets a single request header.
     */
    setHeader(key: string, value: unknown): void {
        this.headers = this.headers || {}
        this.headers[key] = value
    }

    /**
     * Clears current request headers.
     */
    clearHeaders(): void {
        this.headers = {}
    }

    /**
     * Enables cookie jar.
     */
    enableCookies(): void {
        if (this.cookieJar) return

        this.cookieJar = new CookieJar()
        // @ts-expect-error
        this.cookieJar.rejectPublicSuffixes = false
        // @ts-expect-error
        this.cookieJar.looseMode = true
    }

    /**
     * Disables cookie jar.
     */
    disableCookies(): void {
        this.cookieJar = undefined
    }

    /**
     * Sets a cookie.
     * It does not actually add the cookie to the cookie jar
     * because setting the cookie requires the request url,
     * which we only have when making the request.
     */
    setCookie(cookie?: CookieProperty): void {
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
    clearRequestCookies(): void {
        this.cookies = []
    }

    /**
     * Retrieves a cookie by its key.
     */
    getCookie(key: string): Cookie | undefined {
        if (!this.responseCookies) return undefined
        if (!this.responseCookies[key]) return undefined

        return this.responseCookies[key]
    }

    /**
     * Returns current response cookies.
     */
    getCookies(): Record<string, Cookie> {
        return this.responseCookies
    }

    /**
     * Returns the latest collected response.
     */
    getResponse(): AxiosResponse | undefined {
        return this.response
    }

    /**
     * Performs a request using all previously defined parameters:
     * - headers
     * - query
     * - body
     */
    async makeRequest(method: string, requestPath: string, originalBaseUrl: string): Promise<void> {
        try {
            let path = requestPath
            let baseUrl = originalBaseUrl
            if (/https?:\/\//.test(path)) {
                const url = new URL(path)
                path = path.replace(url.origin, '')
                baseUrl = url.origin
            }

            const fullUrl = pathModule.join(baseUrl, path)
            const options: RequestOptions = {
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
                        `Body is only allowed for ${verbsAcceptingBody.join(', ')} methods, found: ${method}`
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
                    for (const [key, value] of Object.entries(this.body)) {
                        formData.append(key, value)
                    }
                    options.data = formData
                }
            }

            // Set initial cookie before make request
            if (this.cookieJar) {
                for (const cookie of this.cookies) {
                    if (isPlainObject(cookie)) {
                        this.cookieJar?.setCookie(new Cookie(cookie), fullUrl)
                    } else if (isString(cookie)) {
                        this.cookieJar?.setCookie(cookie, fullUrl)
                    }
                }
            }
            const client = getClient(this.cookieJar, this.proxy)
            this.response = await client.request(options)

            if (this.cookieJar) {
                this.responseCookies = {}
                const setCookieHeaders = this.response?.headers['set-cookie']
                if (setCookieHeaders) {
                    for (const cookie of setCookieHeaders) {
                        this.cookieJar?.setCookieSync(cookie, fullUrl)
                    }
                }
                for (const cookie of this.cookieJar.getCookiesSync(fullUrl)) {
                    this.responseCookies[cookie.key] = cookie
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.response = error.response
            } else {
                console.error('Unexpected error:', error)
            }
        }
    }
}

/**
 * Create a new isolated http api client
 */
export default function (proxy = false): HttpApiClient {
    return new HttpApiClient(proxy)
}

/**
 * Http api client extension.
 */
export { HttpApiClient }
