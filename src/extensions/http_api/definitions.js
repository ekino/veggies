'use strict'

const { Given, Then, When } = require('cucumber')
const { inspect } = require('util')
const { expect } = require('chai')
const _ = require('lodash')

const Cast = require('../../core/cast')
const { assertObjectMatchSpec } = require('../../core/assertions')

const { STATUS_CODES } = require('http')
const STATUS_MESSAGES = _.values(STATUS_CODES).map(_.lowerCase)

/**
 * Ensures there's a response available and returns it.
 *
 * @param {Object} client
 */
const mustGetResponse = client => {
    const response = client.getResponse()
    expect(response, 'No response available').to.not.be.empty

    return response
}

exports.install = ({ baseUrl = '' } = {}) => {
    /**
     * Setting http headers
     */
    Given(/^(?:I )?set request headers$/, function(step) {
        this.httpApiClient.setHeaders(Cast.object(this.state.populateObject(step.rowsHash())))
    })

    /**
     * Setting http option followRedirect to false
     */
    Given(/^(?:I )?do not follow redirect$/, function() {
        this.httpApiClient.setFollowRedirect(false)
    })

    /**
     * Setting http option followRedirect to true
     */
    Given(/^(?:I )?follow redirect$/, function() {
        this.httpApiClient.setFollowRedirect(true)
    })

    /**
     * Assign http headers
     * The difference from "set request headers" is that "set" set the whole headers object
     * "assign" replace or set the given headers, keeping untouched the ones already set
     */
    Given(/^(?:I )?assign request headers$/, function(step) {
        const headers = Cast.object(this.state.populateObject(step.rowsHash()))
        _.each(headers, (value, key) => this.httpApiClient.setHeader(key, value))
    })

    /**
     * Setting a single http header
     */
    Given(/^(?:I )?set ([a-zA-Z0-9-]+) request header to (.+)$/, function(key, value) {
        this.httpApiClient.setHeader(key, Cast.value(this.state.populate(value)))
    })

    /**
     * Clearing headers
     */
    Given(/^(?:I )?clear request headers/, function() {
        this.httpApiClient.clearHeaders()
    })

    /**
     * Setting json payload
     */
    Given(/^(?:I )?set request json body$/, function(step) {
        this.httpApiClient.setJsonBody(Cast.object(this.state.populateObject(step.rowsHash())))
    })

    /**
     * Setting json payload from fixture file
     */
    Given(/^(?:I )?set request json body from (.+)$/, function(fixture) {
        return this.fixtures.load(fixture).then(data => {
            this.httpApiClient.setJsonBody(data)
        })
    })

    /**
     * Setting form data
     */
    Given(/^(?:I )?set request form body$/, function(step) {
        this.httpApiClient.setFormBody(Cast.object(this.state.populateObject(step.rowsHash())))
    })

    /**
     * Setting form data from fixture file
     */
    Given(/^(?:I )?set request form body from (.+)$/, function(fixture) {
        return this.fixtures.load(fixture).then(data => {
            this.httpApiClient.setFormBody(data)
        })
    })

    /**
     * Setting multipart data from fixture file
     */
    Given(/^(?:I )?set request multipart body from (.+)$/, function(fixture) {
        return this.fixtures.load(fixture).then(data => {
            this.httpApiClient.setMultipartBody(data)
        })
    })

    /**
     * Clearing body
     */
    Given(/^(?:I )?clear request body$/, function() {
        this.httpApiClient.clearBody()
    })

    /**
     * Setting query parameters
     */
    Given(/^(?:I )?set request query$/, function(step) {
        this.httpApiClient.setQuery(Cast.object(this.state.populateObject(step.rowsHash())))
    })

    Given(/^(?:I )?pick response json (.+) as (.+)$/, function(path, key) {
        const response = this.httpApiClient.getResponse()
        const body = response.body

        this.state.set(key, _.get(body, path))
    })

    /**
     * Enabling cookies
     */
    Given(/^(?:I )?enable cookies$/, function() {
        this.httpApiClient.enableCookies()
    })

    /**
     * Disabling cookies
     */
    Given(/^(?:I )?disable cookies$/, function() {
        this.httpApiClient.disableCookies()
    })

    /**
     * Setting a cookie from fixture file
     */
    Given(/^(?:I )?set cookie from (.+)$/, function(fixture) {
        return this.fixtures.load(fixture).then(cookie => {
            this.httpApiClient.setCookie(cookie)
        })
    })

    /**
     * Clearing client request cookies
     */
    Given(/^(?:I )?clear request cookies$/, function() {
        this.httpApiClient.clearRequestCookies()
    })

    /**
     * Resetting the client's state
     */
    When(/^(?:I )?reset http client$/, function() {
        this.httpApiClient.reset()
    })

    /**
     * Performing a request
     */
    When(/^(?:I )?(GET|POST|PUT|DELETE) (.+)$/, function(method, path) {
        return this.httpApiClient.makeRequest(method, this.state.populate(path), baseUrl)
    })

    /**
     * Dumping response body
     */
    When(/^(?:I )?dump response body$/, function() {
        const response = mustGetResponse(this.httpApiClient)
        console.log(inspect(response.body, { colors: true, depth: null })) // eslint-disable-line no-console
    })

    /**
     * Dumping response headers
     */
    When(/^(?:I )?dump response headers$/, function() {
        const response = mustGetResponse(this.httpApiClient)
        console.log(response.headers) // eslint-disable-line no-console
    })

    /**
     * Dumping response cookies
     */
    When(/^(?:I )?dump response cookies$/, function() {
        mustGetResponse(this.httpApiClient)
        console.log(this.httpApiClient.getCookies()) // eslint-disable-line no-console
    })

    /**
     * Checking response status code
     */
    Then(/^response status code should be ([1-5][0-9][0-9])$/, function(statusCode) {
        const response = mustGetResponse(this.httpApiClient)
        expect(
            response.statusCode,
            `Expected status code to be: ${statusCode}, but found: ${response.statusCode}`
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response status by message
     */
    Then(/^response status should be (.+)$/, function(statusMessage) {
        if (!STATUS_MESSAGES.includes(_.lowerCase(statusMessage))) {
            throw new TypeError(`'${statusMessage}' is not a valid status message`)
        }

        const response = mustGetResponse(this.httpApiClient)
        const statusCode = _.findKey(STATUS_CODES, msg => _.lowerCase(msg) === statusMessage)
        const currentStatusMessage = STATUS_CODES[`${response.statusCode}`] || response.statusCode

        expect(
            response.statusCode,
            `Expected status to be: '${statusMessage}', but found: '${_.lowerCase(
                currentStatusMessage
            )}'`
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response cookie is present|absent
     */
    Then(/^response should (not )?have an? (.+) cookie$/, function(flag, key) {
        const cookie = this.httpApiClient.getCookie(key)

        if (flag === undefined) {
            expect(cookie, `No cookie found for key '${key}'`).to.not.be.null
        } else {
            expect(cookie, `A cookie exists for key '${key}'`).to.be.null
        }
    })

    /**
     * Checking response cookie is|isn't secure
     */
    Then(/^response (.+) cookie should (not )?be secure$/, function(key, flag) {
        const cookie = this.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag === undefined) {
            expect(cookie.secure, `Cookie '${key}' is not secure`).to.be.true
        } else {
            expect(cookie.secure, `Cookie '${key}' is secure`).to.be.false
        }
    })

    /**
     * Checking response cookie httpOnly
     */
    Then(/^response (.+) cookie should (not )?be http only$/, function(key, flag) {
        const cookie = this.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag === undefined) {
            expect(cookie.httpOnly, `Cookie '${key}' is not http only`).to.be.true
        } else {
            expect(cookie.httpOnly, `Cookie '${key}' is http only`).to.be.false
        }
    })

    /**
     * Checking response cookie domain
     */
    Then(/^response (.+) cookie domain should (not )?be (.+)$/, function(key, flag, domain) {
        const cookie = this.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag === undefined) {
            expect(
                cookie.domain,
                `Expected cookie '${key}' domain to be '${domain}', found '${cookie.domain}'`
            ).to.equal(domain)
        } else {
            expect(cookie.domain, `Cookie '${key}' domain is '${domain}'`).to.not.equal(domain)
        }
    })

    /**
     * This definition can be used for checking an object response.
     * It check that the properties of this object match with the expected properties
     * The columns header are | field | matcher | value |
     * @see Assertions.assertObjectMatchSpec
     */
    Then(/^(?:I )?json response should (fully )?match$/, function(fully, table) {
        const response = mustGetResponse(this.httpApiClient)
        const { body } = response

        // We check the response has json content-type
        expect(response.headers['content-type']).to.contain('application/json')

        // First we populate spec values if it contains some placeholder
        const spec = table.hashes().map(fieldSpec =>
            _.assign({}, fieldSpec, {
                value: this.state.populate(fieldSpec.value)
            })
        )

        assertObjectMatchSpec(body, spec, !!fully)
    })

    /**
     * This definition verify that an array for a given path has the expected length
     */
    Then(/^(?:I )?should receive a collection of ([0-9]+) items?(?: for path )?(.+)?$/, function(
        size,
        path
    ) {
        const response = mustGetResponse(this.httpApiClient)
        const { body } = response

        const array = path !== undefined ? _.get(body, path) : body

        expect(array.length).to.be.equal(Number(size))
    })

    /**
     * Verifies that response matches a fixture.
     **/
    Then(/^response should match fixture (.+)$/, function(fixtureId) {
        const response = mustGetResponse(this.httpApiClient)

        return this.fixtures.load(fixtureId).then(snapshot => {
            expect(response.body).to.deep.equal(snapshot)
        })
    })

    /**
     * Checking response header.
     */
    Then(/^response header (.+) should (not )?(equal|contain|match) (.+)$/, function(
        key,
        flag,
        comparator,
        expectedValue
    ) {
        const response = mustGetResponse(this.httpApiClient)
        const header = response.headers[key.toLowerCase()]

        expect(header, `Header '${key}' does not exist`).to.not.be.undefined

        let expectFn = expect(
            header,
            `Expected header '${key}' to ${
                flag ? flag : ''
            }${comparator} '${expectedValue}', but found '${header}' which does${
                flag ? '' : ' not'
            }`
        ).to
        if (flag !== undefined) {
            expectFn = expectFn.not
        }
        expectFn[comparator](comparator === 'match' ? new RegExp(expectedValue) : expectedValue)
    })
}
