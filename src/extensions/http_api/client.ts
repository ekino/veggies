import { Cookie, CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import { isPlainObject, isString } from '../../utils/index.js'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import FormData from 'form-data'
import { CookieProperty, RequestBody, RequestHeaders, RequestOptions } from '../../types.js'

const BODY_TYPE_JSON = 'json'
const BODY_TYPE_FORM = 'form'
const BODY_TYPE_MULTIPART = 'form-data'
const verbsAcceptingBody = ['POST', 'PUT', 'DELETE', 'PATCH']
const validateStatus = (status: number) => status >= 200 && status <= 302

const axiosInstance = axios.create({
    validateStatus,
})
let cookieInstance: AxiosInstance

const getClient = (cookieJar?: CookieJar): AxiosInstance => {
    if (cookieJar) {
        if (!cookieInstance) {
            cookieInstance = wrapper(
                // @ts-ignore
                axios.create({
                    // @ts-ignore
                    jar: cookieJar,
                    withCredentials: true,
                    validateStatus,
                }),
            ) as AxiosInstance
        }
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
    public bodyType: string = BODY_TYPE_JSON
    public headers: RequestHeaders = {}
    public query: Record<string, unknown> = {}
    public cookies: CookieProperty[] = []
    public cookieJar: CookieJar | undefined
    public followRedirect: boolean = true
    public response: AxiosResponse | undefined
    public responseCookies: Record<string, Cookie> = {}

    constructor() {
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
        // @ts-ignore
        this.cookieJar.rejectPublicSuffixes = false
        // @ts-ignore
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
        if (this.responseCookies === null) return undefined
        if (this.responseCookies[key] === undefined) return undefined

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
     * Performs a request using all previously defined paramaters:
     * - headers
     * - query
     * - body
     */
    async makeRequest(method: string, path: string, baseUrl?: string): Promise<void> {
        try {
            if (/https?:\/\//.test(path)) {
                const url = new URL(path)
                path = path.replace(url.origin, '')
                baseUrl = url.origin
            }

            const fullUrl = `${baseUrl}${path}`
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
                        this.cookieJar?.setCookie(new Cookie(cookie), fullUrl)
                    } else if (isString(cookie)) {
                        this.cookieJar?.setCookie(cookie, fullUrl)
                    }
                })
            }
            const client = getClient(this.cookieJar)
            const _response = await client.request(options)
            this.response = _response

            if (this.cookieJar) {
                this.responseCookies = {}
                const setCookieHeaders = this.response.headers['set-cookie']
                if (setCookieHeaders) {
                    setCookieHeaders.forEach((cookie) => {
                        this.cookieJar?.setCookieSync(cookie, fullUrl)
                    })
                }
                this.cookieJar.getCookiesSync(fullUrl).forEach((cookie) => {
                    this.responseCookies[cookie.key] = cookie
                })
            }
        } catch (error) {
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
        }
    }
}

/**
 * Create a new isolated http api client
 */
export default function (...args: HttpApiClientArgs): HttpApiClient {
    return new HttpApiClient(...args)
}

/**
 * Http api client extension.
 */
export { HttpApiClient }
