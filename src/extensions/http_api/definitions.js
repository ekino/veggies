'use strict'

const { expect } = require('chai')
const _ = require('lodash')

const Cast = require('../../cast')
const Helper = require('../../helper')

const { STATUS_CODES } = require('http')
const STATUS_MESSAGES = _.values(STATUS_CODES).map(_.lowerCase)

module.exports = ({ baseUrl = '' } = {}) => ({ Given, When, Then }) => {
    /**
     * Setting http headers
     */
    Given(/^(?:I )?set request headers$/, function(step) {
        this.httpApiClient.setHeaders(Cast.object(this.state.populateObject(step.rowsHash())))
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
            console.log(data) // eslint-disable-line no-console
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
            console.log(data) // eslint-disable-line no-console
            this.httpApiClient.setFormBody(data)
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

    Given(/^(?:I )?enable cookies$/, function() {
        this.httpApiClient.enableCookies()
    })

    Given(/^(?:I )?disable cookies$/, function() {
        this.httpApiClient.disableCookies()
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
        const httpResponse = this.httpApiClient.getResponse()
        console.log(httpResponse.body) // eslint-disable-line no-console
    })

    /**
     * Checking response status code
     */
    Then(/^response status code should be ([1-5][0-9][0-9])$/, function(statusCode) {
        const httpResponse = this.httpApiClient.getResponse()
        expect(httpResponse, 'Response is empty').to.not.be.empty
        expect(httpResponse.statusCode, `Expected status code to be: ${statusCode}, but found: ${httpResponse.statusCode}`).to.equal(
            Number(statusCode)
        )
    })

    /**
     * Checking response status by message
     */
    Then(/^response status should be (.+)$/, function(statusMessage) {
        if (!STATUS_MESSAGES.includes(_.lowerCase(statusMessage))) {
            throw new TypeError(`'${statusMessage}' is not a valid status message`)
        }

        const httpResponse = this.httpApiClient.getResponse()
        expect(httpResponse, 'Response is empty').to.not.be.empty

        const statusCode = _.findKey(STATUS_CODES, msg => _.lowerCase(msg) === statusMessage)
        const currentStatusMessage = STATUS_CODES[`${httpResponse.statusCode}`] || httpResponse.statusCode

        expect(
            httpResponse.statusCode,
            `Expected status to be: '${statusMessage}', but found: '${_.lowerCase(currentStatusMessage)}'`
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
            expect(cookie.domain, `Expected cookie '${key}' domain to be '${domain}', found '${cookie.domain}'`).to.equal(domain)
        } else {
            expect(cookie.domain, `Cookie '${key}' domain is '${domain}'`).to.not.equal(domain)
        }
    })

    /**
     * This definition can be used for checking an object response.
     * It check that the properties of this object match with the expected properties
     * The columns header are | field | matcher | value |
     * You can define severals matchers :
     * - equals
     * - contains
     */
    Then(/^(?:I )?should receive a json response (fully )?matching$/, function(fully, table) {
        const response = this.httpApiClient.getResponse()
        const body = response.body

        const expectedProperties = table.hashes()

        // We check the response has json content-type
        expect(response.headers['content-type']).to.contain('application/json')

        // We check response properties correspond to the expected response
        expectedProperties.forEach(propertyMatcher => {
            const expectedValue = Cast.value(this.state.populate(propertyMatcher.value))

            switch (propertyMatcher.matcher) {
                case 'contains':
                    expect(_.get(body, propertyMatcher.field)).to.contain(expectedValue)
                    break
                case 'equals':
                default:
                    expect(_.get(body, propertyMatcher.field)).to.be.deep.equal(expectedValue)
            }
        })

        // We check we have exactly the same number of properties as expected
        if (fully) {
            const propertiesCount = Helper.countNestedProperties(body)
            expect(propertiesCount).to.be.equal(table.hashes().length)
        }
    })

    /**
     * This definition verify that an array for a given path has the expected length
     */
    Then(/^(?:I )?should receive a collection of ([0-9]+) items?(?: for path )?(.+)?$/, function(size, path) {
        const { body } = this.httpApiClient.getResponse()
        const array = path !== undefined ? _.get(body, path) : body

        expect(array.length).to.be.equal(Number(size))
    })

    /**
     * Verifies that response matches snapshot.
     */
    Then(/^response should match snapshot (.+)$/, function(snapshotId) {
        const httpResponse = this.httpApiClient.getResponse()
        expect(httpResponse).to.not.be.empty

        return this.fixtures.load(snapshotId).then(snapshot => {
            expect(httpResponse.body).to.deep.equal(snapshot)
        })
    })
}
