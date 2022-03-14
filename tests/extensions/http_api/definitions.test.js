'use strict'

const sinon = require('sinon')

jest.mock('fs')
const fs = require('fs')

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/http_api/definitions')

beforeEach(() => {
    definitions.install()
})

afterEach(() => {
    helper.clearContext()
})

test('set request headers', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('set request headers')
    def.shouldMatch('I set request headers')
    def.shouldMatch('set request headers')

    const clientMock = {
        httpApiClient: { setHeaders: jest.fn() },
        state: { populateObject: (o) => o },
    }
    const headers = {
        Accept: 'application/json',
        'User-Agent': 'veggies/1.0',
    }
    def.exec(clientMock, { rowsHash: () => headers })
    expect(clientMock.httpApiClient.setHeaders).toHaveBeenCalledWith(headers)
})

test('assign request headers', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('assign request headers')
    def.shouldMatch('I assign request headers')
    def.shouldMatch('assign request headers')

    const clientMock = {
        httpApiClient: { setHeader: jest.fn() },
        state: { populateObject: (o) => o },
    }
    const headers = {
        Accept: 'application/json',
        'User-Agent': 'veggies/1.0',
    }
    def.exec(clientMock, { rowsHash: () => headers })
    expect(clientMock.httpApiClient.setHeader).toHaveBeenCalledTimes(2)
    expect(clientMock.httpApiClient.setHeader).toHaveBeenCalledWith('Accept', 'application/json')
    expect(clientMock.httpApiClient.setHeader).toHaveBeenCalledWith('User-Agent', 'veggies/1.0')
})

test('set a single request header', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('request header to')
    def.shouldNotMatch('I set Accept request header to ')
    def.shouldMatch('I set Accept request header to test', ['Accept', 'test'])
    def.shouldMatch('set Accept request header to test', ['Accept', 'test'])

    const clientMock = {
        httpApiClient: { setHeader: jest.fn() },
        state: { populate: (v) => v },
    }
    def.exec(clientMock, 'Accept', 'test')
    expect(clientMock.httpApiClient.setHeader).toHaveBeenCalledWith('Accept', 'test')
})

test('set a single request header with a dash', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('request header to')
    def.shouldMatch('I set X-Custom request header to test', ['X-Custom', 'test'])
    def.shouldMatch('set X-Custom request header to test', ['X-Custom', 'test'])

    const clientMock = {
        httpApiClient: { setHeader: jest.fn() },
        state: { populate: (v) => v },
    }
    def.exec(clientMock, 'X-Custom', 'test')
    expect(clientMock.httpApiClient.setHeader).toHaveBeenCalledWith('X-Custom', 'test')
})

test('set a single request header with an underscore', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('request header to')
    def.shouldMatch('I set X_Custom request header to test', ['X_Custom', 'test'])
    def.shouldMatch('set X_Custom request header to test', ['X_Custom', 'test'])

    const clientMock = {
        httpApiClient: { setHeader: jest.fn() },
        state: { populate: (v) => v },
    }
    def.exec(clientMock, 'X_Custom', 'test')
    expect(clientMock.httpApiClient.setHeader).toHaveBeenCalledWith('X_Custom', 'test')
})

test('clear request headers', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('clear request headers')
    def.shouldMatch('I clear request headers')
    def.shouldMatch('clear request headers')

    const clientMock = { httpApiClient: { clearHeaders: jest.fn() } }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.clearHeaders).toHaveBeenCalled()
})

test('set request json body', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('set request json body$')
    def.shouldMatch('I set request json body')
    def.shouldMatch('set request json body')
})

test('set request json body from fixture file', () => {
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
        httpApiClient: { setJsonBody: jest.fn() },
        fixtures: { load: jest.fn(() => Promise.resolve(fixture)) },
    }

    return def.exec(worldMock, 'fixture').then(() => {
        expect(worldMock.fixtures.load).toHaveBeenCalledWith('fixture')
        expect(worldMock.httpApiClient.setJsonBody).toHaveBeenCalledWith(fixture)
    })
})

test('set request form body', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('set request form body$')
    def.shouldMatch('I set request form body')
    def.shouldMatch('set request form body')
})

test('set request form body from fixture file', () => {
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
        httpApiClient: { setFormBody: jest.fn() },
        fixtures: { load: jest.fn(() => Promise.resolve(fixture)) },
    }

    return def.exec(worldMock, 'fixture').then(() => {
        expect(worldMock.fixtures.load).toHaveBeenCalledWith('fixture')
        expect(worldMock.httpApiClient.setFormBody).toHaveBeenCalledWith(fixture)
    })
})

test('set request multipart body from', () => {
    const context = helper.getContext() // Extension context

    expect.assertions(5)

    const def = context.getDefinitionByMatcher('set request multipart body from')
    def.shouldNotMatch('I set request multipart body from ')
    def.shouldMatch('I set request multipart body from fixture')
    def.shouldMatch('set request multipart body from fixture')

    const fixture = {
        id: '2',
        file: fs.createReadStream('path/to/file', {}),
    }
    const worldMock = {
        httpApiClient: { setMultipartBody: jest.fn() },
        fixtures: { load: jest.fn(() => Promise.resolve(fixture)) },
    }

    return def.exec(worldMock, 'fixture').then(() => {
        expect(worldMock.fixtures.load).toHaveBeenCalledWith('fixture')
        expect(worldMock.httpApiClient.setMultipartBody).toHaveBeenCalledWith(fixture)
    })
})

test('clear request body', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('clear request body')
    def.shouldMatch('I clear request body')
    def.shouldMatch('clear request body')

    const clientMock = { httpApiClient: { clearBody: jest.fn() } }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.clearBody).toHaveBeenCalled()
})

test('set request query', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('set request query')
    def.shouldMatch('I set request query')
    def.shouldMatch('set request query')

    const clientMock = {
        httpApiClient: { setQuery: jest.fn() },
        state: { populateObject: (o) => o },
    }
    const query = {
        is_active: 'true',
        id: '2',
    }
    def.exec(clientMock, { rowsHash: () => query })
    expect(clientMock.httpApiClient.setQuery).toHaveBeenCalledWith(query)
})

test('follow redirect', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('?follow redirect')
    def.shouldMatch('I follow redirect')
    def.shouldMatch('follow redirect')

    const clientMock = {
        httpApiClient: { setFollowRedirect: jest.fn() },
    }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.setFollowRedirect).toHaveBeenCalledWith(true)
})

test('do not follow redirect', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('do not follow redirect')
    def.shouldMatch('I do not follow redirect')
    def.shouldMatch('do not follow redirect')

    const clientMock = {
        httpApiClient: { setFollowRedirect: jest.fn() },
    }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.setFollowRedirect).toHaveBeenCalledWith(false)
})

test('pick response json|header property', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('pick response (json|header) (.+) as (.+)')
    def.shouldNotMatch('I pick response json  as ')
    def.shouldMatch('I pick response json key as value', ['json', 'key', 'value'])
    def.shouldMatch('pick response json key as value', ['json', 'key', 'value'])
    def.shouldMatch('I pick response header key as value', ['header', 'key', 'value'])
    def.shouldMatch('pick response header key as value', ['header', 'key', 'value'])
})

test('replace value of state key', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher(
        'replace(?: placeholder)? (.+) in (.+) to ([^\\s]+)(?: with regex options? (.+)?)?'
    )
    def.shouldNotMatch('replace key {token} in URLPage to')
    def.shouldNotMatch('I replace {token} in URLPage to   ')
    def.shouldMatch('replace {token} in URLPage to abcd', ['{token}', 'URLPage', 'abcd'])
    def.shouldMatch('I replace placeholder {token} in URLPage to abcd', [
        '{token}',
        'URLPage',
        'abcd',
    ])
    def.shouldMatch('I replace placeholder {token} in URLPage to abcd with regex option gi', [
        '{token}',
        'URLPage',
        'abcd',
        'gi',
    ])
    def.shouldMatch('I replace {token} in URLPage to abcd with regex options gi', [
        '{token}',
        'URLPage',
        'abcd',
        'gi',
    ])
    const URLPage = 'http://localhost:300/api/{token}/page'
    const newURLPage = 'http://localhost:300/api/abcd/page'
    const stateMock = {
        state: {
            get: jest.fn().mockImplementation(() => URLPage),
            set: jest.fn().mockImplementation(() => newURLPage),
        },
    }

    def.exec(stateMock, '{token}', 'URLPage', 'abcd', 'gi')
    expect(stateMock.state.get).toHaveBeenCalledWith('URLPage')
    expect(stateMock.state.set).toHaveBeenCalledWith('URLPage', newURLPage)
})

test('enable cookies', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('enable cookies')
    def.shouldMatch('I enable cookies')
    def.shouldMatch('enable cookies')

    const clientMock = { httpApiClient: { enableCookies: jest.fn() } }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.enableCookies).toHaveBeenCalled()
})

test('disable cookies', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('disable cookies')
    def.shouldMatch('I disable cookies')
    def.shouldMatch('disable cookies')

    const clientMock = { httpApiClient: { disableCookies: jest.fn() } }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.disableCookies).toHaveBeenCalled()
})

test('test cookie is present', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response should (not )?have an? (.+) cookie')
    def.shouldNotMatch('response should have a  cookie')
    def.shouldNotMatch('response should have an  cookie')
    def.shouldMatch('response should have a test cookie', [undefined, 'test'])
    def.shouldMatch('response should have an test cookie', [undefined, 'test'])

    const getCookie = sinon.stub()
    getCookie.withArgs('cookie_exist').returns('some content')
    getCookie.withArgs('cookie_dont_exist').returns(null)

    const clientMock = { httpApiClient: { getCookie } }

    expect(() => def.exec(clientMock, undefined, 'cookie_exist')).not.toThrow()
    expect(() => def.exec(clientMock, undefined, 'cookie_dont_exist')).toThrow(
        "No cookie found for key 'cookie_dont_exist': expected null not to be null"
    )
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

    const getCookie = sinon.stub()
    getCookie.withArgs('cookie_exist').returns('some content')
    getCookie.withArgs('cookie_dont_exist').returns(null)

    const clientMock = { httpApiClient: { getCookie: getCookie } }

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

    const getCookie = sinon.stub()
    getCookie.withArgs('secure_cookie').returns({ secure: true })
    getCookie.withArgs('not_secure_cookie').returns({ secure: false })
    const clientMock = { httpApiClient: { getCookie: getCookie } }

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

    const getCookie = sinon.stub()
    getCookie.withArgs('secure_cookie').returns({ secure: true })
    getCookie.withArgs('not_secure_cookie').returns({ secure: false })
    const clientMock = { httpApiClient: { getCookie: getCookie } }

    expect(() => def.exec(clientMock, 'secure_cookie', 'not ')).toThrow(
        "Cookie 'secure_cookie' is secure: expected true to be false"
    )
    expect(() => def.exec(clientMock, 'not_secure_cookie', 'not ')).not.toThrow()
})

test('test cookie is http only', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response (.+) cookie should (not )?be http only')
    def.shouldNotMatch('response  cookie should be http only')
    def.shouldMatch('response test cookie should be http only', ['test', undefined])

    const getCookie = sinon.stub()
    getCookie.withArgs('http_only').returns({ httpOnly: true })
    getCookie.withArgs('not_http_only').returns({ httpOnly: false })
    const clientMock = { httpApiClient: { getCookie: getCookie } }

    expect(() => def.exec(clientMock, 'http_only', undefined)).not.toThrow()
    expect(() => def.exec(clientMock, 'not_http_only', undefined)).toThrow(
        "Cookie 'not_http_only' is not http only: expected false to be true"
    )
})

test('test cookie is not http only', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response (.+) cookie should (not )?be http only')
    def.shouldNotMatch('response  cookie should not be http only')
    def.shouldMatch('response test cookie should not be http only', ['test', 'not '])

    const getCookie = sinon.stub()
    getCookie.withArgs('http_only').returns({ httpOnly: true })
    getCookie.withArgs('not_http_only').returns({ httpOnly: false })
    const clientMock = { httpApiClient: { getCookie: getCookie } }

    expect(() => def.exec(clientMock, 'http_only', 'not ')).toThrow(
        "Cookie 'http_only' is http only: expected true to be false"
    )
    expect(() => def.exec(clientMock, 'not_http_only', 'not ')).not.toThrow()
})

test('test cookie domain equals given value', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response (.+) cookie domain should (not )?be (.+)')
    def.shouldNotMatch('response  cookie domain should be domain')
    def.shouldNotMatch('response test cookie domain should be ')
    def.shouldMatch('response test cookie domain should be domain', ['test', undefined, 'domain'])

    const getCookie = sinon.stub()
    getCookie.withArgs('domain1').returns({ domain: 'domain1' })
    getCookie.withArgs('domain2').returns({ domain: 'domain2' })
    const clientMock = { httpApiClient: { getCookie: getCookie } }

    expect(() => def.exec(clientMock, 'domain1', undefined, 'domain1')).not.toThrow()
    expect(() => def.exec(clientMock, 'domain2', undefined, 'domain1')).toThrow(
        `Expected cookie 'domain2' domain to be 'domain1', found 'domain2': expected 'domain2' to equal 'domain1'`
    )
})

test('test cookie domain does not equal given value', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response (.+) cookie domain should (not )?be (.+)')
    def.shouldNotMatch('response  cookie domain should not be domain')
    def.shouldNotMatch('response test cookie domain should not be ')
    def.shouldMatch('response test cookie domain should not be domain', ['test', 'not ', 'domain'])

    const getCookie = sinon.stub()
    getCookie.withArgs('domain1').returns({ domain: 'domain1' })
    getCookie.withArgs('domain2').returns({ domain: 'domain2' })
    const clientMock = { httpApiClient: { getCookie: getCookie } }

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

    const clientMock = { httpApiClient: { reset: jest.fn() } }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.reset).toHaveBeenCalled()
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
        httpApiClient: { getResponse: jest.fn(() => ({ body: '' })) },
    }
    def.exec(clientMock)
    expect(clientMock.httpApiClient.getResponse).toHaveBeenCalled()
})

test('check response HTTP status code', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response status code should be')
    def.shouldNotMatch('response status code should be ')
    def.shouldNotMatch('response status code should be string')
    def.shouldNotMatch('response status code should be 600')
    def.shouldMatch('response status code should be 200', ['200'])
    def.shouldMatch('response status code should be 404', ['404'])

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ statusCode: 200 })
    getResponse.onSecondCall().returns({ statusCode: 400 })
    const clientMock = { httpApiClient: { getResponse: getResponse } }

    expect(() => def.exec(clientMock, '200')).not.toThrow()
    expect(() => def.exec(clientMock, '200')).toThrow(
        `Expected status code to be: 200, but found: 400: expected 400 to equal 200`
    )
})

test('check response HTTP status by message', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('response status should be')
    def.shouldNotMatch('response status should be ')
    def.shouldMatch('response status should be ok', ['ok'])
    def.shouldMatch('response status should be forbidden', ['forbidden'])

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ statusCode: 200 })
    getResponse.onSecondCall().returns({ statusCode: 500 })
    const clientMock = { httpApiClient: { getResponse: getResponse } }

    expect(() => def.exec(clientMock, 'ok')).not.toThrow()
    expect(() => def.exec(clientMock, 'ok')).toThrow(
        `Expected status to be: 'ok', but found: 'internal server error': expected 500 to equal 200`
    )
    expect(() => def.exec(clientMock, 'invalid')).toThrow(`'invalid' is not a valid status message`)
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { name: 'john', gender: 'male' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { name: 'john' },
    })
    getResponse.onThirdCall().returns({
        headers: { 'content-type': 'application/json' },
        body: {},
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response property equals expected value', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { name: 'plouc' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { name: 'john' },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response property contains value', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'raphael', last_name: 'benn' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'raphael', last_name: 'be' },
    })
    getResponse.onThirdCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'rap', last_name: 'ben' },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response property matches regexp', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'raphael', last_name: 'benn' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'raphael', last_name: 'be' },
    })
    getResponse.onThirdCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'rap', last_name: 'ben' },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response property matches expressions', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Johnny' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Bob' },
    })
    getResponse.onThirdCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'John' },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response property matches negated expressions', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Bob' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Johnny' },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response property matches padded expressions', () => {
    const context = helper.getContext()

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'John', note: "I'm a geek!" },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json response fully matches spec', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('json response should (fully )?match')

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Raphaël', last_name: 'ben' },
    })
    getResponse.onSecondCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Raphaël', last_name: 'ben', gender: 'male' },
    })
    getResponse.onThirdCall().returns({
        headers: { 'content-type': 'application/json' },
        body: { first_name: 'Raphaël', last_name: 'be' },
    })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
})

test('check json collection size for a given path', () => {
    const context = helper.getContext() // Extension context

    const def = context.getDefinitionByMatcher('should receive a collection of')
    def.shouldNotMatch('I should receive a collection of x items for path whatever')
    def.shouldMatch('I should receive a collection of 1 item for path property', ['1', 'property'])
    def.shouldMatch('I should receive a collection of 2 items for path property', ['2', 'property'])
    def.shouldMatch('should receive a collection of 1 item for path property', ['1', 'property'])
    def.shouldMatch('should receive a collection of 2 items', ['2', undefined])

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ body: { property: ['a', 'b', 'c'] } })
    getResponse.onSecondCall().returns({ body: { property: ['a', 'b'] } })
    const clientMock = { httpApiClient: { getResponse: getResponse } }

    expect(() => def.exec(clientMock, '3', 'property')).not.toThrow()
    expect(() => def.exec(clientMock, '3', 'property')).toThrow(`expected 2 to equal 3`)
})

test('response match fixture', () => {
    const context = helper.getContext() // Extension context

    expect.assertions(5)

    const def = context.getDefinitionByMatcher('should match fixture')
    def.shouldNotMatch('response should match fixture ')
    def.shouldMatch('response should match fixture fixture', ['fixture'])

    const snapshot = { testing: true }
    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ statusCode: 200, body: snapshot })
    getResponse.onSecondCall().returns({ statusCode: 200, body: { app: true } })
    const worldMock = {
        httpApiClient: { getResponse: getResponse },
        fixtures: { load: jest.fn(() => Promise.resolve(snapshot)) },
    }

    return Promise.all([
        expect(def.exec(worldMock, 'snapshot')).resolves.toBe(),
        expect(def.exec(worldMock, 'snapshot')).rejects.toThrow(
            `expected { app: true } to deeply equal { testing: true }`
        ),
    ])
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
    getResponse.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
    getResponse.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
    getResponse.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
    getResponse.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
    }

    expect(() => def.exec(clientMock, 'Content-Type', 'not ', 'equal', 'application/json')).toThrow(
        `Expected header 'Content-Type' to not equal 'application/json', but found 'application/json' which does: expected 'application/json' to not equal 'application/json'`
    )
    expect(() =>
        def.exec(clientMock, 'Content-Type', 'not ', 'equal', 'application/json')
    ).not.toThrow()
    expect(() => def.exec(clientMock, 'Content-Type', 'not ', 'equal', 'application/json')).toThrow(
        `Header 'Content-Type' does not exist: expected undefined not to be undefined`
    )
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
    getResponse.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
    getResponse.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
    }

    expect(() => def.exec(clientMock, 'Content-Type', undefined, 'contain', 'json')).not.toThrow()
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
    getResponse.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
    getResponse.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
    getResponse.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
    getResponse.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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

    const getResponse = sinon.stub()
    getResponse.onFirstCall().returns({ headers: { 'content-type': 'application/json' } })
    getResponse.onSecondCall().returns({ headers: { 'content-type': 'application/xml' } })
    getResponse.onThirdCall().returns({ headers: { 'another-header': 'application/json' } })
    const clientMock = {
        state: { populate: (v) => v },
        httpApiClient: { getResponse: getResponse },
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
