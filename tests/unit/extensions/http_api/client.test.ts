import axios from 'axios'
import { describe, expect, test, vi } from 'vitest'
import { HttpApiClient } from '../../../../src/extensions/http_api/client.js'

vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal<typeof import('axios')>()
    const mockAxiosInstance = {
        request: vi.fn().mockResolvedValue({ status: 200, data: { ok: true } }),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    }
    return {
        default: {
            ...actual.default,
            create: vi.fn(() => mockAxiosInstance),
            isAxiosError: actual.default.isAxiosError,
        },
    }
})

describe('extensions > http_api > client', () => {
    test('makeRequest handles http URLs correctly without malforming them', async () => {
        const client = new HttpApiClient()

        await client.makeRequest('GET', '/test', 'http://example.com')

        const mockCreate = vi.mocked(axios.create)
        const mockAxiosInstance = mockCreate.mock.results[0]?.value

        expect(mockAxiosInstance.request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'http://example.com/test',
            })
        )
    })
})
