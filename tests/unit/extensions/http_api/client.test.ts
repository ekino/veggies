import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import type { Cookie } from 'tough-cookie'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import createClient, { HttpApiClient } from '../../../../src/extensions/http_api/client.js'

vi.mock('axios')
vi.mock('axios-cookiejar-support', () => ({
    wrapper: (instance: unknown) => instance,
}))

describe('extensions > http_api > client', () => {
    let mockAxiosInstance: { request: ReturnType<typeof vi.fn> }
    let mockAxiosCreate: ReturnType<typeof vi.fn>

    beforeEach(() => {
        mockAxiosInstance = {
            request: vi.fn(),
        }
        mockAxiosCreate = vi.fn(() => mockAxiosInstance as unknown as AxiosInstance)
        vi.mocked(axios.create).mockImplementation(mockAxiosCreate as typeof axios.create)
        vi.mocked(axios.isAxiosError).mockReturnValue(false)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('createClient factory function', () => {
        test('should create client with proxy disabled by default', () => {
            const client = createClient()

            expect(client).toBeInstanceOf(HttpApiClient)
            expect(client.proxy).toBe(false)
        })

        test('should create client with proxy enabled when specified', () => {
            const client = createClient(true)

            expect(client).toBeInstanceOf(HttpApiClient)
            expect(client.proxy).toBe(true)
        })

        test('should create client with proxy explicitly disabled', () => {
            const client = createClient(false)

            expect(client).toBeInstanceOf(HttpApiClient)
            expect(client.proxy).toBe(false)
        })
    })

    describe('HttpApiClient constructor', () => {
        test('should initialize with default proxy value (false)', () => {
            const client = new HttpApiClient()

            expect(client.proxy).toBe(false)
            expect(client.body).toBeUndefined()
            expect(client.bodyType).toBe('json')
            expect(client.headers).toEqual({})
            expect(client.query).toEqual({})
            expect(client.cookies).toEqual([])
            expect(client.cookieJar).toBeUndefined()
            expect(client.followRedirect).toBe(true)
            expect(client.response).toBeUndefined()
            expect(client.responseCookies).toEqual({})
        })

        test('should initialize with proxy enabled', () => {
            const client = new HttpApiClient(true)

            expect(client.proxy).toBe(true)
        })

        test('should initialize with proxy disabled', () => {
            const client = new HttpApiClient(false)

            expect(client.proxy).toBe(false)
        })
    })

    describe('makeRequest with proxy configuration', () => {
        test('should maintain proxy setting through client lifecycle', () => {
            const clientDisabled = createClient(false)
            const clientEnabled = createClient(true)

            // Verify proxy is set correctly
            expect(clientDisabled.proxy).toBe(false)
            expect(clientEnabled.proxy).toBe(true)

            // Proxy should remain unchanged through various operations
            clientDisabled.setJsonBody({ test: 'data' })
            clientEnabled.setJsonBody({ test: 'data' })

            expect(clientDisabled.proxy).toBe(false)
            expect(clientEnabled.proxy).toBe(true)
        })

        test('should pass proxy config to axios when using cookie jar with proxy disabled', async () => {
            const client = createClient(false)
            client.enableCookies()

            mockAxiosInstance.request.mockResolvedValue({
                data: { success: true },
                headers: {},
                status: 200,
            })

            await client.makeRequest('GET', '/test', 'http://localhost')

            // When cookieJar is used, a new axios instance is created
            expect(mockAxiosCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    validateStatus: expect.any(Function),
                    withCredentials: true,
                    proxy: false, // proxy should be explicitly false
                })
            )
        })

        test('should pass undefined proxy config when proxy is enabled with cookie jar', async () => {
            const client = createClient(true)
            client.enableCookies()

            mockAxiosInstance.request.mockResolvedValue({
                data: { success: true },
                headers: {},
                status: 200,
            })

            await client.makeRequest('GET', '/test', 'http://localhost')

            // When proxy is true, it should be undefined to allow axios default behavior
            expect(mockAxiosCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    validateStatus: expect.any(Function),
                    withCredentials: true,
                    proxy: undefined, // proxy should be undefined when enabled
                })
            )
        })

        test('should verify proxy configuration is maintained in client', () => {
            const clientWithProxyDisabled = createClient(false)
            const clientWithProxyEnabled = createClient(true)

            expect(clientWithProxyDisabled.proxy).toBe(false)
            expect(clientWithProxyEnabled.proxy).toBe(true)

            // Proxy setting should be used when making requests with cookie jar
            clientWithProxyDisabled.enableCookies()
            clientWithProxyEnabled.enableCookies()

            expect(clientWithProxyDisabled.proxy).toBe(false)
            expect(clientWithProxyEnabled.proxy).toBe(true)
        })

        test('should create new cookie instance for each request with different proxy settings', async () => {
            const client1 = createClient(false)
            client1.enableCookies()

            const client2 = createClient(true)
            client2.enableCookies()

            mockAxiosInstance.request.mockResolvedValue({
                data: {},
                headers: {},
                status: 200,
            })

            await client1.makeRequest('GET', '/test1', 'http://localhost')
            await client2.makeRequest('GET', '/test2', 'http://localhost')

            const calls = mockAxiosCreate.mock.calls
            // Both should create new instances with different proxy configs
            expect(calls.length).toBeGreaterThanOrEqual(2)

            // Find calls with cookiejar configs
            const cookieJarCalls = calls.filter((call) => {
                const config = call[0] as Record<string, unknown>
                return config?.['jar'] !== undefined
            })
            expect(cookieJarCalls.length).toBeGreaterThanOrEqual(2)
        })
    })

    describe('reset method', () => {
        test('should not reset proxy configuration', () => {
            const client = createClient(true)
            client.setJsonBody({ test: 'data' })
            client.setHeader('Authorization', 'Bearer token')
            client.enableCookies()

            expect(client.proxy).toBe(true)
            expect(client.body).toBeDefined()
            expect(client.headers).not.toEqual({})
            expect(client.cookieJar).toBeDefined()

            client.reset()

            // Proxy should remain unchanged after reset
            expect(client.proxy).toBe(true)
            // But other properties should be reset
            expect(client.body).toBeUndefined()
            expect(client.headers).toEqual({})
            expect(client.cookieJar).toBeUndefined()
        })

        test('should reset all properties except proxy', () => {
            const client = createClient(false)
            client.setJsonBody({ data: 'test' })
            client.setHeaders({ 'X-Custom': 'header' })
            client.setQuery({ param: 'value' })
            client.enableCookies()
            client.setFollowRedirect(false)

            // Simulate a response
            const mockResponse = {
                data: {},
                headers: {},
                status: 200,
                statusText: 'OK',
                config: {},
            } as AxiosResponse
            const mockCookie = {} as Cookie
            client.response = mockResponse
            client.responseCookies = { testCookie: mockCookie }

            client.reset()

            expect(client.proxy).toBe(false) // Proxy remains
            expect(client.body).toBeUndefined()
            expect(client.bodyType).toBe('json')
            expect(client.headers).toEqual({})
            expect(client.query).toEqual({})
            expect(client.cookies).toEqual([])
            expect(client.cookieJar).toBeUndefined()
            expect(client.followRedirect).toBe(true)
            expect(client.response).toBeUndefined()
            expect(client.responseCookies).toEqual({})
        })
    })

    describe('proxy property immutability', () => {
        test('should maintain proxy setting throughout client lifecycle', () => {
            const client = createClient(true)

            expect(client.proxy).toBe(true)

            client.setJsonBody({ test: 'data' })
            expect(client.proxy).toBe(true)

            client.setHeaders({ 'Content-Type': 'application/json' })
            expect(client.proxy).toBe(true)

            client.enableCookies()
            expect(client.proxy).toBe(true)

            client.setFollowRedirect(false)
            expect(client.proxy).toBe(true)

            client.clearBody()
            expect(client.proxy).toBe(true)

            client.clearHeaders()
            expect(client.proxy).toBe(true)

            client.disableCookies()
            expect(client.proxy).toBe(true)
        })
    })
})
