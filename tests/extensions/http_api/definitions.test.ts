import { createSandbox, SinonStub } from 'sinon'

import * as helper from '../definitions_helper'
import * as definitions from '../../../src/extensions/http_api/definitions'
import { httpApiClient } from '../../../src/extensions/http_api'
import { fixtures } from '../../../src/extensions/fixtures'

describe('extensions > http_api > definitions', () => {
    const sandbox = createSandbox()
    let setHeadersStub: SinonStub,
        setHeaderStub: SinonStub,
        clearHeadersStub: SinonStub,
        setJsonBodyStub: SinonStub,
        loadFixturesStub: SinonStub,
        setFormBodyStub: SinonStub,
        setMultipartBodyStub: SinonStub,
        clearBodyStub: SinonStub,
        setQueryStub: SinonStub,
        setFollowRedirectStub: SinonStub,
        enableCookiesStub: SinonStub,
        disableCookiesStub: SinonStub,
        getCookieStub: SinonStub,
        resetStub: SinonStub,
        getResponseStub: SinonStub

    beforeAll(() => {
        setHeadersStub = sandbox.stub(httpApiClient, 'setHeaders')
        setHeaderStub = sandbox.stub(httpApiClient, 'setHeader')
        clearHeadersStub = sandbox.stub(httpApiClient, 'clearHeaders')
        setJsonBodyStub = sandbox.stub(httpApiClient, 'setJsonBody')
        loadFixturesStub = sandbox.stub(fixtures, 'load')
        setFormBodyStub = sandbox.stub(httpApiClient, 'setFormBody')
        setMultipartBodyStub = sandbox.stub(httpApiClient, 'setMultipartBody')
        clearBodyStub = sandbox.stub(httpApiClient, 'clearBody')
        setQueryStub = sandbox.stub(httpApiClient, 'setQuery')
        setFollowRedirectStub = sandbox.stub(httpApiClient, 'setFollowRedirect')
        enableCookiesStub = sandbox.stub(httpApiClient, 'enableCookies')
        disableCookiesStub = sandbox.stub(httpApiClient, 'disableCookies')
        getCookieStub = sandbox.stub(httpApiClient, 'getCookie')
        resetStub = sandbox.stub(httpApiClient, 'reset')
        getResponseStub = sandbox.stub(httpApiClient, 'getResponse')
    })
    beforeEach(() => definitions.install())

    afterEach(() => {
        helper.clearContext()
        sandbox.reset()
    })
    afterAll(() => sandbox.restore())

    test('set request headers', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('set request headers')
        def.shouldMatch('I set request headers')
        def.shouldMatch('set request headers')

        const clientMock = {
            httpApiClient: { setHeaders: setHeadersStub },
            state: { populateObject: (o: string): string => o },
        }
        const headers = {
            Accept: 'application/json',
            'User-Agent': 'veggies/1.0',
        }
        def.exec(clientMock, { rowsHash: () => headers })
        expect(clientMock.httpApiClient.setHeaders.calledWithExactly(headers)).toBeTruthy()
    })

    test('assign request headers', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('assign request headers')
        def.shouldMatch('I assign request headers')
        def.shouldMatch('assign request headers')

        const clientMock = {
            httpApiClient: { setHeader: setHeaderStub },
            state: { populateObject: (o: string): string => o },
        }
        const headers = {
            Accept: 'application/json',
            'User-Agent': 'veggies/1.0',
        }
        def.exec(clientMock, { rowsHash: () => headers })
        expect(
            clientMock.httpApiClient.setHeader.calledWithExactly('Accept', 'application/json')
        ).toBeTruthy()
        expect(
            clientMock.httpApiClient.setHeader.calledWithExactly('User-Agent', 'veggies/1.0')
        ).toBeTruthy()
    })

    test('set a single request header', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('request header to')
        def.shouldNotMatch('I set Accept request header to ')
        def.shouldMatch('I set Accept request header to test', ['Accept', 'test'])
        def.shouldMatch('set Accept request header to test', ['Accept', 'test'])

        const clientMock = {
            httpApiClient: { setHeader: setHeaderStub },
            state: { populate: (v: string): string => v },
        }
        def.exec(clientMock, 'Accept', 'test')
        expect(clientMock.httpApiClient.setHeader.calledWithExactly('Accept', 'test')).toBeTruthy()
    })

    test('set a single request header with a dash', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('request header to')
        def.shouldMatch('I set X-Custom request header to test', ['X-Custom', 'test'])
        def.shouldMatch('set X-Custom request header to test', ['X-Custom', 'test'])

        const clientMock = {
            httpApiClient: { setHeader: setHeaderStub },
            state: { populate: (v: string): string => v },
        }
        def.exec(clientMock, 'X-Custom', 'test')
        expect(
            clientMock.httpApiClient.setHeader.calledWithExactly('X-Custom', 'test')
        ).toBeTruthy()
    })

    test('set a single request header with an underscore', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('request header to')
        def.shouldMatch('I set X_Custom request header to test', ['X_Custom', 'test'])
        def.shouldMatch('set X_Custom request header to test', ['X_Custom', 'test'])

        const clientMock = {
            httpApiClient: { setHeader: setHeaderStub },
            state: { populate: (v: string): string => v },
        }
        def.exec(clientMock, 'X_Custom', 'test')
        expect(
            clientMock.httpApiClient.setHeader.calledWithExactly('X_Custom', 'test')
        ).toBeTruthy()
    })

    test('clear request headers', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('clear request headers')
        def.shouldMatch('I clear request headers')
        def.shouldMatch('clear request headers')

        const clientMock = { httpApiClient: { clearHeaders: clearHeadersStub } }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.clearHeaders.calledOnce).toBeTruthy()
    })

    test('set request json body', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('set request json body$')
        def.shouldMatch('I set request json body')
        def.shouldMatch('set request json body')
    })

    test('set request json body from fixture file', async () => {
        const context = helper.getContext() // Extension context

        expect.assertions(5)

        const def = context.getDefinitionByMatcher('set request json body from')
        def.shouldNotMatch('I set request json body from ')
        def.shouldMatch('I set request json body from fixture')
        def.shouldMatch('set request json body from fixture')

        const fixture = {
            is_active: 'true',
            id: '2',
        }
        const worldMock = {
            httpApiClient: { setJsonBody: setJsonBodyStub },
            fixtures: { load: loadFixturesStub },
        }
        loadFixturesStub.resolves(fixture)

        await def.exec(worldMock, 'fixture')
        expect(worldMock.fixtures.load.calledWithExactly('fixture')).toBeTruthy()
        expect(worldMock.httpApiClient.setJsonBody.calledOnceWithExactly(fixture)).toBeTruthy()
    })

    test('set request form body', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('set request form body$')
        def.shouldMatch('I set request form body')
        def.shouldMatch('set request form body')
    })

    test('set request form body from fixture file', async () => {
        const context = helper.getContext() // Extension context

        expect.assertions(5)

        const def = context.getDefinitionByMatcher('set request form body from')
        def.shouldNotMatch('I set request form body from ')
        def.shouldMatch('I set request form body from fixture')
        def.shouldMatch('set request form body from fixture')

        const fixture = {
            is_active: 'true',
            id: '2',
        }
        const worldMock = {
            httpApiClient: { setFormBody: setFormBodyStub },
            fixtures: { load: loadFixturesStub },
        }
        loadFixturesStub.resolves(fixture)

        await def.exec(worldMock, 'fixture')
        expect(worldMock.fixtures.load.calledWithExactly('fixture')).toBeTruthy()
        expect(worldMock.httpApiClient.setFormBody.calledWithExactly(fixture)).toBeTruthy()
    })

    test('set request multipart body from', async () => {
        const context = helper.getContext() // Extension context

        expect.assertions(5)

        const def = context.getDefinitionByMatcher('set request multipart body from')
        def.shouldNotMatch('I set request multipart body from ')
        def.shouldMatch('I set request multipart body from fixture')
        def.shouldMatch('set request multipart body from fixture')

        const fixture = {
            id: '2',
            file: 'some-file',
        }
        const worldMock = {
            httpApiClient: { setMultipartBody: setMultipartBodyStub },
            fixtures: { load: loadFixturesStub },
        }
        loadFixturesStub.resolves(fixture)

        await def.exec(worldMock, 'fixture')
        expect(worldMock.fixtures.load.calledWithExactly('fixture')).toBeTruthy()
        expect(worldMock.httpApiClient.setMultipartBody.calledWithExactly(fixture)).toBeTruthy()
    })

    test('clear request body', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('clear request body')
        def.shouldMatch('I clear request body')
        def.shouldMatch('clear request body')

        const clientMock = { httpApiClient: { clearBody: clearBodyStub } }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.clearBody.calledOnce).toBeTruthy()
    })

    test('set request query', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('set request query')
        def.shouldMatch('I set request query')
        def.shouldMatch('set request query')

        const clientMock = {
            httpApiClient: { setQuery: setQueryStub },
            state: { populateObject: (o: string): string => o },
        }
        const query = {
            is_active: 'true',
            id: '2',
        }
        def.exec(clientMock, { rowsHash: () => query })
        expect(clientMock.httpApiClient.setQuery.calledOnce).toBeTruthy()
    })

    test('follow redirect', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('?follow redirect')
        def.shouldMatch('I follow redirect')
        def.shouldMatch('follow redirect')

        const clientMock = {
            httpApiClient: { setFollowRedirect: setFollowRedirectStub },
        }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.setFollowRedirect.calledWithExactly(true)).toBeTruthy()
    })

    test('do not follow redirect', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('do not follow redirect')
        def.shouldMatch('I do not follow redirect')
        def.shouldMatch('do not follow redirect')

        const clientMock = {
            httpApiClient: { setFollowRedirect: setFollowRedirectStub },
        }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.setFollowRedirect.calledWithExactly(false)).toBeTruthy()
    })

    test('pick response json property', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('pick response json')
        def.shouldNotMatch('I pick response json  as ')
        def.shouldMatch('I pick response json key as value', ['key', 'value'])
        def.shouldMatch('pick response json key as value', ['key', 'value'])
    })

    test('enable cookies', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('enable cookies')
        def.shouldMatch('I enable cookies')
        def.shouldMatch('enable cookies')

        const clientMock = { httpApiClient: { enableCookies: enableCookiesStub } }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.enableCookies.calledOnce).toBeTruthy()
    })

    test('disable cookies', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('disable cookies')
        def.shouldMatch('I disable cookies')
        def.shouldMatch('disable cookies')

        const clientMock = { httpApiClient: { disableCookies: disableCookiesStub } }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.disableCookies.calledOnce).toBeTruthy()
    })

    test('test cookie is present', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response should (not )?have an? (.+) cookie')
        def.shouldNotMatch('response should have a  cookie')
        def.shouldNotMatch('response should have an  cookie')
        def.shouldMatch('response should have a test cookie', [undefined, 'test'])
        def.shouldMatch('response should have an test cookie', [undefined, 'test'])

        const clientMock = { httpApiClient: { getCookie: getCookieStub } }
        getCookieStub.withArgs('cookie_exist').returns('some content')
        getCookieStub.withArgs('cookie_dont_exist').returns(null)

        expect(() => def.exec(clientMock, undefined, 'cookie_exist')).not.toThrow()
        expect(() => def.exec(clientMock, undefined, 'cookie_dont_exist')).toThrow(
            "No cookie found for key 'cookie_dont_exist': expected null not to be null"
        )
        expect(getCookieStub.calledTwice).toBeTruthy()
    })

    test('test cookie is absent', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response should (not )?have an? (.+) cookie')
        def.shouldNotMatch('response should crap have a  cookie')
        def.shouldNotMatch('response should crap have an  cookie')
        def.shouldNotMatch('response should not have a  cookie')
        def.shouldNotMatch('response should not have an  cookie')
        def.shouldMatch('response should not have a test cookie', ['not ', 'test'])
        def.shouldMatch('response should not have an test cookie', ['not ', 'test'])

        getCookieStub.withArgs('cookie_exist').returns('some content')
        getCookieStub.withArgs('cookie_dont_exist').returns(null)

        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'not ', 'cookie_exist')).toThrow(
            "A cookie exists for key 'cookie_exist': expected 'some content' to be null"
        )
        expect(() => def.exec(clientMock, 'not ', 'cookie_dont_exist')).not.toThrow()
    })

    test('test cookie is secure', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response (.+) cookie should (not )?be secure')
        def.shouldNotMatch('response  cookie should be secure')
        def.shouldMatch('response test cookie should be secure', ['test', undefined])

        getCookieStub.withArgs('secure_cookie').returns({ secure: true })
        getCookieStub.withArgs('not_secure_cookie').returns({ secure: false })
        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'secure_cookie', undefined)).not.toThrow()
        expect(() => def.exec(clientMock, 'not_secure_cookie', undefined)).toThrow(
            "Cookie 'not_secure_cookie' is not secure: expected false to be true"
        )
    })

    test('test cookie is not secure', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response (.+) cookie should (not )?be secure')
        def.shouldNotMatch('response  cookie should not be secure')
        def.shouldMatch('response test cookie should not be secure', ['test', 'not '])

        getCookieStub.withArgs('secure_cookie').returns({ secure: true })
        getCookieStub.withArgs('not_secure_cookie').returns({ secure: false })
        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'secure_cookie', 'not ')).toThrow(
            "Cookie 'secure_cookie' is secure: expected true to be false"
        )
        expect(() => def.exec(clientMock, 'not_secure_cookie', 'not ')).not.toThrow()
    })

    test('test cookie is http only', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response (.+) cookie should (not )?be http only'
        )
        def.shouldNotMatch('response  cookie should be http only')
        def.shouldMatch('response test cookie should be http only', ['test', undefined])

        getCookieStub.withArgs('http_only').returns({ httpOnly: true })
        getCookieStub.withArgs('not_http_only').returns({ httpOnly: false })
        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'http_only', undefined)).not.toThrow()
        expect(() => def.exec(clientMock, 'not_http_only', undefined)).toThrow(
            "Cookie 'not_http_only' is not http only: expected false to be true"
        )
    })

    test('test cookie is not http only', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response (.+) cookie should (not )?be http only'
        )
        def.shouldNotMatch('response  cookie should not be http only')
        def.shouldMatch('response test cookie should not be http only', ['test', 'not '])

        getCookieStub.withArgs('http_only').returns({ httpOnly: true })
        getCookieStub.withArgs('not_http_only').returns({ httpOnly: false })
        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'http_only', 'not ')).toThrow(
            "Cookie 'http_only' is http only: expected true to be false"
        )
        expect(() => def.exec(clientMock, 'not_http_only', 'not ')).not.toThrow()
    })

    test('test cookie domain equals given value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response (.+) cookie domain should (not )?be (.+)'
        )
        def.shouldNotMatch('response  cookie domain should be domain')
        def.shouldNotMatch('response test cookie domain should be ')
        def.shouldMatch('response test cookie domain should be domain', [
            'test',
            undefined,
            'domain',
        ])

        getCookieStub.withArgs('domain1').returns({ domain: 'domain1' })
        getCookieStub.withArgs('domain2').returns({ domain: 'domain2' })
        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'domain1', undefined, 'domain1')).not.toThrow()
        expect(() => def.exec(clientMock, 'domain2', undefined, 'domain1')).toThrow(
            `Expected cookie 'domain2' domain to be 'domain1', found 'domain2': expected 'domain2' to equal 'domain1'`
        )
    })

    test('test cookie domain does not equal given value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response (.+) cookie domain should (not )?be (.+)'
        )
        def.shouldNotMatch('response  cookie domain should not be domain')
        def.shouldNotMatch('response test cookie domain should not be ')
        def.shouldMatch('response test cookie domain should not be domain', [
            'test',
            'not ',
            'domain',
        ])

        getCookieStub.withArgs('domain1').returns({ domain: 'domain1' })
        getCookieStub.withArgs('domain2').returns({ domain: 'domain2' })
        const clientMock = { httpApiClient: { getCookie: getCookieStub } }

        expect(() => def.exec(clientMock, 'domain1', 'not ', 'domain1')).toThrow(
            `Cookie 'domain1' domain is 'domain1': expected 'domain1' to not equal 'domain1'`
        )
        expect(() => def.exec(clientMock, 'domain2', 'not ', 'domain1')).not.toThrow()
    })

    test('reset http client', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('reset http client')
        def.shouldMatch('I reset http client')
        def.shouldMatch('reset http client')

        const clientMock = { httpApiClient: { reset: resetStub } }
        def.exec(clientMock)
        expect(clientMock.httpApiClient.reset.calledOnce).toBeTruthy()
    })

    test('perform a request', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('GET|POST|PUT|DELETE|PATCH')
        def.shouldNotMatch('I GET ')
        def.shouldMatch('I GET /', ['GET', '/'])
        def.shouldMatch('I POST /create', ['POST', '/create'])
        def.shouldMatch('I PUT /update', ['PUT', '/update'])
        def.shouldMatch('I DELETE /delete', ['DELETE', '/delete'])
        def.shouldMatch('I PATCH /updatePartial', ['PATCH', '/updatePartial'])
        def.shouldMatch('GET /', ['GET', '/'])
        def.shouldMatch('POST /create', ['POST', '/create'])
        def.shouldMatch('PUT /update', ['PUT', '/update'])
        def.shouldMatch('DELETE /delete', ['DELETE', '/delete'])
        def.shouldMatch('PATCH /updatePartial', ['PATCH', '/updatePartial'])
    })

    test('dump response body', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('dump response body')
        def.shouldMatch('I dump response body')
        def.shouldMatch('dump response body')

        const clientMock = {
            httpApiClient: { getResponse: getResponseStub },
        }
        getResponseStub.returns({ body: '' })
        def.exec(clientMock)
        expect(clientMock.httpApiClient.getResponse.calledOnce).toBeTruthy()
    })

    test('check response HTTP status code', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response status code should be')
        def.shouldNotMatch('response status code should be ')
        def.shouldNotMatch('response status code should be string')
        def.shouldNotMatch('response status code should be 600')
        def.shouldMatch('response status code should be 200', ['200'])
        def.shouldMatch('response status code should be 404', ['404'])

        getResponseStub.onFirstCall().returns({ statusCode: 200 })
        getResponseStub.onSecondCall().returns({ statusCode: 400 })
        const clientMock = { httpApiClient: { getResponse: getResponseStub } }

        expect(() => def.exec(clientMock, '200')).not.toThrow()
        expect(() => def.exec(clientMock, '200')).toThrow(
            `Expected status code to be: 200, but found: 400: expected 400 to equal 200`
        )
        expect(getResponseStub.calledTwice).toBeTruthy()
    })

    test('check response HTTP status by message', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('response status should be')
        def.shouldNotMatch('response status should be ')
        def.shouldMatch('response status should be ok', ['ok'])
        def.shouldMatch('response status should be forbidden', ['forbidden'])

        getResponseStub.onFirstCall().returns({ statusCode: 200 })
        getResponseStub.onSecondCall().returns({ statusCode: 500 })
        const clientMock = { httpApiClient: { getResponse: getResponseStub } }

        expect(() => def.exec(clientMock, 'ok')).not.toThrow()
        expect(() => def.exec(clientMock, 'ok')).toThrow(
            `Expected status to be: 'ok', but found: 'internal server error': expected 500 to equal 200`
        )
        expect(() => def.exec(clientMock, 'invalid')).toThrow(
            `'invalid' is not a valid status message`
        )
        expect(getResponseStub.calledTwice).toBeTruthy()
    })

    test('check json response', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('json response should (fully )?match')
        def.shouldMatch('json response should match', [undefined])
        def.shouldMatch('json response should fully match', ['fully '])
    })

    test('check json response property is defined', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { name: 'john', gender: 'male' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { name: 'john' },
        })
        getResponseStub.onThirdCall().returns({
            headers: { 'content-type': 'application/json' },
            body: {},
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }
        const spec = [
            {
                field: 'name',
                matcher: 'defined',
            },
            {
                field: 'gender',
                matcher: 'present',
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'gender' is undefined: expected undefined not to be undefined`
        )
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'name' is undefined: expected undefined not to be undefined`
        )
        expect(getResponseStub.calledThrice).toBeTruthy()
    })

    test('check json response property equals expected value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { name: 'plouc' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { name: 'john' },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                field: 'name',
                matcher: 'equals',
                value: 'plouc',
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Expected property 'name' to equal 'plouc', but found 'john': expected 'john' to deeply equal 'plouc'`
        )
        expect(getResponseStub.calledTwice).toBeTruthy()
    })

    test('check json response property contains value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'raphael', last_name: 'benn' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'raphael', last_name: 'be' },
        })
        getResponseStub.onThirdCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'rap', last_name: 'ben' },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                field: 'first_name',
                matcher: 'contain',
                value: 'raph',
            },
            {
                field: 'last_name',
                matcher: 'contains',
                value: 'ben',
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'last_name' (be) does not contain 'ben': expected 'be' to include 'ben'`
        )
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'first_name' (rap) does not contain 'raph': expected 'rap' to include 'raph'`
        )
        expect(getResponseStub.calledThrice).toBeTruthy()
    })

    test('check json response property matches regexp', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'raphael', last_name: 'benn' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'raphael', last_name: 'be' },
        })
        getResponseStub.onThirdCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'rap', last_name: 'ben' },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                field: 'first_name',
                matcher: 'matches',
                value: 'raph',
            },
            {
                field: 'last_name',
                matcher: 'match',
                value: 'ben',
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'last_name' (be) does not match 'ben': expected 'be' to match /ben/`
        )
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'first_name' (rap) does not match 'raph': expected 'rap' to match /raph/`
        )
        expect(getResponseStub.calledThrice).toBeTruthy()
    })

    test('check json response property matches expressions', () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Johnny' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Bob' },
        })
        getResponseStub.onThirdCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'John' },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                expression: 'first_name ?',
            },
            {
                expression: 'first_name #= string',
            },
            {
                expression: 'first_name ^= Jo',
            },
            {
                expression: 'first_name *= hn',
            },
            {
                expression: 'first_name $= ny',
            },
            {
                expression: 'first_name ~= ^Johnny$',
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'first_name' (Bob) does not start with 'Jo': expected 'Bob' to start with 'Jo'`
        )
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'first_name' (John) does not end with 'ny': expected 'John' to end with 'ny'`
        )
        expect(getResponseStub.calledThrice).toBeTruthy()
    })

    test('check json response property matches negated expressions', () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Bob' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Johnny' },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                expression: 'last_name !?',
            },
            {
                expression: 'first_name !#= number',
            },
            {
                expression: 'first_name !^= Jo',
            },
            {
                expression: 'first_name !*= hn',
            },
            {
                expression: 'first_name !$= ny',
            },
            {
                expression: 'first_name !~= ^Johnny$',
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).toThrow(
            `Property 'first_name' (Johnny) starts with 'Jo': expected 'Johnny' not to start with 'Jo'`
        )
        expect(getResponseStub.calledTwice).toBeTruthy()
    })

    test('check json response property matches padded expressions', () => {
        const context = helper.getContext()

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'John', note: "I'm a geek!" },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                expression: 'first_name          ?  ',
            },
            {
                expression: 'first_name         #=        string',
            },
            {
                expression: 'first_name        !~=      ^Bob$',
            },
            {
                expression: "note        =      I'm a geek!",
            },
        ]

        expect(() => def.exec(clientMock, undefined, { hashes: () => spec })).not.toThrow()
        expect(getResponseStub.calledOnce).toBeTruthy()
    })

    test('check json response fully matches spec', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('json response should (fully )?match')

        getResponseStub.onFirstCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Raphaël', last_name: 'ben' },
        })
        getResponseStub.onSecondCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Raphaël', last_name: 'ben', gender: 'male' },
        })
        getResponseStub.onThirdCall().returns({
            headers: { 'content-type': 'application/json' },
            body: { first_name: 'Raphaël', last_name: 'be' },
        })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        const spec = [
            {
                field: 'first_name',
                matcher: 'equal',
                value: 'Raphaël',
            },
            {
                field: 'last_name',
                matcher: 'match',
                value: 'ben',
            },
        ]

        expect(() => def.exec(clientMock, 'fully ', { hashes: () => spec })).not.toThrow()
        expect(() => def.exec(clientMock, 'fully ', { hashes: () => spec })).toThrow(
            `Expected json response to fully match spec, but it does not: expected 3 to equal 2`
        )
        expect(() => def.exec(clientMock, 'fully ', { hashes: () => spec })).toThrow(
            `Property 'last_name' (be) does not match 'ben': expected 'be' to match /ben/`
        )
        expect(getResponseStub.calledThrice).toBeTruthy()
    })

    test('check json collection size for a given path', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('should receive a collection of')
        def.shouldNotMatch('I should receive a collection of x items for path whatever')
        def.shouldMatch('I should receive a collection of 1 item for path property', [
            '1',
            'property',
        ])
        def.shouldMatch('I should receive a collection of 2 items for path property', [
            '2',
            'property',
        ])
        def.shouldMatch('should receive a collection of 1 item for path property', [
            '1',
            'property',
        ])
        def.shouldMatch('should receive a collection of 2 items', ['2', undefined])

        getResponseStub.onFirstCall().returns({ body: { property: ['a', 'b', 'c'] } })
        getResponseStub.onSecondCall().returns({ body: { property: ['a', 'b'] } })
        const clientMock = { httpApiClient: { getResponse: getResponseStub } }

        expect(() => def.exec(clientMock, '3', 'property')).not.toThrow()
        expect(() => def.exec(clientMock, '3', 'property')).toThrow(`expected 2 to equal 3`)
    })

    test('response match fixture', async () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher('should match fixture')
        def.shouldNotMatch('response should match fixture ')
        def.shouldMatch('response should match fixture fixture', ['fixture'])

        const snapshot = { testing: true }

        getResponseStub.onFirstCall().returns({ statusCode: 200, body: snapshot })
        getResponseStub.onSecondCall().returns({ statusCode: 200, body: { app: true } })
        const worldMock = {
            httpApiClient: { getResponse: getResponseStub },
            fixtures: { load: loadFixturesStub },
        }
        loadFixturesStub.resolves(snapshot)

        await def.exec(worldMock, 'snapshot')
        await expect(def.exec(worldMock, 'snapshot')).rejects.toThrow(
            `expected { app: true } to deeply equal { testing: true }`
        )
        expect(getResponseStub.calledTwice).toBeTruthy()
        expect(loadFixturesStub.calledTwice).toBeTruthy()
    })

    test('check response header value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )
        def.shouldNotMatch('response header  should match pattern ')
        def.shouldNotMatch('response header Content-Type should match ')
        def.shouldNotMatch('response header Content-Type should invalid thing')
    })

    test('check response header equals expected value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )

        def.shouldMatch('response header Content-Type should equal application/json', [
            'Content-Type',
            undefined,
            'equal',
            'application/json',
        ])

        getResponseStub.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
        getResponseStub.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
        getResponseStub.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'equal', 'application/json')
        ).not.toThrow()
        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'equal', 'application/json')
        ).toThrow(
            `Expected header 'Content-Type' to equal 'application/json', but found 'application/xml' which does not: expected 'application/xml' to equal 'application/json'`
        )
        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'equal', 'application/json')
        ).toThrow(`Header 'Content-Type' does not exist: expected undefined not to be undefined`)
    })

    test('check response header does not equal expected value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )

        def.shouldMatch('response header Content-Type should not equal application/json', [
            'Content-Type',
            'not ',
            'equal',
            'application/json',
        ])

        getResponseStub.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
        getResponseStub.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
        getResponseStub.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        expect(() =>
            def.exec(clientMock, 'Content-Type', 'not ', 'equal', 'application/json')
        ).toThrow(
            `Expected header 'Content-Type' to not equal 'application/json', but found 'application/json' which does: expected 'application/json' to not equal 'application/json'`
        )
        expect(() =>
            def.exec(clientMock, 'Content-Type', 'not ', 'equal', 'application/json')
        ).not.toThrow()
        expect(() =>
            def.exec(clientMock, 'Content-Type', 'not ', 'equal', 'application/json')
        ).toThrow(`Header 'Content-Type' does not exist: expected undefined not to be undefined`)
    })

    test('check response header contains value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )

        def.shouldMatch('response header Content-Type should contain application/json', [
            'Content-Type',
            undefined,
            'contain',
            'application/json',
        ])

        getResponseStub.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
        getResponseStub.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
        getResponseStub.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'contain', 'json')
        ).not.toThrow()
        expect(() => def.exec(clientMock, 'Content-Type', undefined, 'contain', 'json')).toThrow(
            `Expected header 'Content-Type' to contain 'json', but found 'application/xml' which does not: expected 'application/xml' to include 'json'`
        )
        expect(() => def.exec(clientMock, 'Content-Type', undefined, 'contain', 'json')).toThrow(
            `Header 'Content-Type' does not exist: expected undefined not to be undefined`
        )
    })

    test('check response header does not contain value', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )

        def.shouldMatch('response header Content-Type should not contain application/json', [
            'Content-Type',
            'not ',
            'contain',
            'application/json',
        ])

        getResponseStub.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
        getResponseStub.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
        getResponseStub.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        expect(() => def.exec(clientMock, 'Content-Type', 'not ', 'contain', 'json')).toThrow(
            `Expected header 'Content-Type' to not contain 'json', but found 'application/json' which does: expected 'application/json' to not include 'json'`
        )
        expect(() => def.exec(clientMock, 'Content-Type', 'not ', 'contain', 'json')).not.toThrow()
        expect(() => def.exec(clientMock, 'Content-Type', 'not ', 'contain', 'json')).toThrow(
            `Header 'Content-Type' does not exist: expected undefined not to be undefined`
        )
    })

    test('check response header matches regexp', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )

        def.shouldMatch('response header Content-Type should match ^application/json$', [
            'Content-Type',
            undefined,
            'match',
            '^application/json$',
        ])

        getResponseStub.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
        getResponseStub.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
        getResponseStub.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'match', '^application/json$')
        ).not.toThrow()
        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'match', '^application/json$')
        ).toThrow(
            `Expected header 'Content-Type' to match '^application/json$', but found 'application/xml' which does not: expected 'application/xml' to match /^application\\/json$/`
        )
        expect(() =>
            def.exec(clientMock, 'Content-Type', undefined, 'match', '^application/json$')
        ).toThrow(`Header 'Content-Type' does not exist: expected undefined not to be undefined`)
    })

    test('check response header does not match regexp', () => {
        const context = helper.getContext() // Extension context

        const def = context.getDefinitionByMatcher(
            'response header (.+) should (not )?(equal|contain|match)'
        )

        def.shouldMatch('response header Content-Type should not match ^application/json$', [
            'Content-Type',
            'not ',
            'match',
            '^application/json$',
        ])

        getResponseStub.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
        getResponseStub.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
        getResponseStub.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
        const clientMock = {
            state: { populate: (v: string): string => v },
            httpApiClient: { getResponse: getResponseStub },
        }

        expect(() =>
            def.exec(clientMock, 'Content-Type', 'not ', 'match', '^application/json$')
        ).toThrow(
            `Expected header 'Content-Type' to not match '^application/json$', but found 'application/json' which does: expected 'application/json' not to match /^application\\/json$/`
        )
        expect(() =>
            def.exec(clientMock, 'Content-Type', 'not ', 'match', '^application/json$')
        ).not.toThrow()
        expect(() =>
            def.exec(clientMock, 'Content-Type', 'not ', 'match', '^application/json$')
        ).toThrow(`Header 'Content-Type' does not exist: expected undefined not to be undefined`)
    })
})
