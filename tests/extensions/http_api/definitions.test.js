'use strict'

const helper = require('../definitions_helper')
const definitions = require('../../../src/extensions/http_api/definitions')()

test('should allow to set request headers', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set request headers')
    def.shouldHaveType('Given')
    def.shouldMatch('I set request headers')
    def.shouldMatch('set request headers')
})

test('should allow to set a single request header', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('request header to')
    def.shouldHaveType('Given')
    def.shouldNotMatch('I set Accept request header to ')
    def.shouldMatch('I set Accept request header to test', ['Accept', 'test'])
    def.shouldMatch('set Accept request header to test', ['Accept', 'test'])
})

test('should allow to set request json body', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set request json body')
    def.shouldHaveType('Given')
    def.shouldMatch('I set request json body')
    def.shouldMatch('set request json body')
})

test('should allow to set request form body', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set request form body')
    def.shouldHaveType('Given')
    def.shouldMatch('I set request form body')
    def.shouldMatch('set request form body')
})

test('should allow to set request query', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('set request query')
    def.shouldHaveType('Given')
    def.shouldMatch('I set request query')
    def.shouldMatch('set request query')
})

test('should allow to pick response json property', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('pick response json')
    def.shouldHaveType('Given')
    def.shouldNotMatch('I pick response json  as ')
    def.shouldMatch('I pick response json key as value', ['key', 'value'])
    def.shouldMatch('pick response json key as value', ['key', 'value'])
})

test('should allow to reset http client', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('reset http client')
    def.shouldHaveType('When')
    def.shouldMatch('I reset http client')
    def.shouldMatch('reset http client')
})

test('should allow to perform a request', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('GET|POST|PUT|DELETE')
    def.shouldHaveType('When')
    def.shouldNotMatch('I GET ')
    def.shouldMatch('I GET /', ['GET', '/'])
    def.shouldMatch('I POST /create', ['POST', '/create'])
    def.shouldMatch('I PUT /update', ['PUT', '/update'])
    def.shouldMatch('I DELETE /delete', ['DELETE', '/delete'])
    def.shouldMatch('GET /', ['GET', '/'])
    def.shouldMatch('POST /create', ['POST', '/create'])
    def.shouldMatch('PUT /update', ['PUT', '/update'])
    def.shouldMatch('DELETE /delete', ['DELETE', '/delete'])
})

test('should allow to dump response body', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('dump response body')
    def.shouldHaveType('When')
    def.shouldMatch('I dump response body')
    def.shouldMatch('dump response body')
})

test('should allow to check response HTTP status code', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('HTTP status code')
    def.shouldHaveType('Then')
    def.shouldNotMatch('I should receive a crap HTTP status code')
    def.shouldNotMatch('I should receive a 600 HTTP status code')
    def.shouldMatch('I should receive a 200 HTTP status code', ['200'])
    def.shouldMatch('I should receive a 404 HTTP status code', ['404'])
    def.shouldMatch('should receive a 200 HTTP status code', ['200'])
    def.shouldMatch('should receive a 404 HTTP status code', ['404'])
})

test('should allow to check json response', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('should receive a json response')
    def.shouldHaveType('Then')
    def.shouldMatch('I should receive a json response matching', [undefined])
    def.shouldMatch('I should receive a json response fully matching', ['fully '])
    def.shouldMatch('should receive a json response matching', [undefined])
    def.shouldMatch('should receive a json response fully matching', ['fully '])
})

test('should allow to check json collection size for a given path', () => {
    const context = helper.define(definitions)

    const def = context.getDefinitionByMatcher('should receive a collection of')
    def.shouldHaveType('Then')
    def.shouldNotMatch('I should receive a collection of x items for path whatever')
    def.shouldNotMatch('I should receive a collection of 2 items for path ')
    def.shouldMatch('I should receive a collection of 1 item for path property', ['1', 'property'])
    def.shouldMatch('I should receive a collection of 2 items for path property', ['2', 'property'])
    def.shouldMatch('should receive a collection of 1 item for path property', ['1', 'property'])
    def.shouldMatch('should receive a collection of 2 items for path property', ['2', 'property'])
})
