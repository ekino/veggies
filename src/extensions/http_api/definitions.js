'use strict'

import { Given, Then, When, world } from '@cucumber/cucumber'
import { inspect } from 'node:util'
import { expect } from 'chai'
import { STATUS_CODES } from 'http'

import * as Cast from '../../core/cast.js'
import { assertObjectMatchSpec } from '../../core/assertions.js'
import { parseMatchExpression } from './utils.js'
import { getValue, findKey } from '../../utils/index.js'

const STATUS_MESSAGES = Object.values(STATUS_CODES)
    .map((code) => (code ? code.toLowerCase() : undefined))
    .filter((code) => !!code)

/**
 * Ensures there's a response available and returns it.
 *
 * @param {Object} client
 */
const mustGetResponse = (client) => {
    const response = client.getResponse()
    expect(response, 'No response available').to.not.be.empty

    return response
}

export const install = ({ baseUrl = '' } = {}) => {
    /**
     * Setting http headers
     */
    Given(/^(?:I )?set request headers$/, (step) => {
        world.httpApiClient.setHeaders(Cast.object(world.state.populateObject(step.rowsHash())))
    })

    /**
     * Setting http option followRedirect to false
     */
    Given(/^(?:I )?do not follow redirect$/, () => {
        world.httpApiClient.setFollowRedirect(false)
    })

    /**
     * Setting http option followRedirect to true
     */
    Given(/^(?:I )?follow redirect$/, () => {
        world.httpApiClient.setFollowRedirect(true)
    })

    /**
     * Assign http headers
     * The difference from "set request headers" is that "set" set the whole headers object
     * "assign" replace or set the given headers, keeping untouched the ones already set
     */
    Given(/^(?:I )?assign request headers$/, (step) => {
        const headers = Cast.object(world.state.populateObject(step.rowsHash()))
        Object.entries(headers).forEach(([key, value]) => {
            world.httpApiClient.setHeader(key, value)
        })
    })

    /**
     * Setting a single http header
     */
    Given(/^(?:I )?set ([a-zA-Z0-9-_]+) request header to (.+)$/, (key, value) => {
        world.httpApiClient.setHeader(key, Cast.getCastedValue(world.state.populate(value)))
    })

    /**
     * Clearing headers
     */
    Given(/^(?:I )?clear request headers/, () => {
        world.httpApiClient.clearHeaders()
    })

    /**
     * Setting json payload
     */
    Given(/^(?:I )?set request json body$/, (step) => {
        world.httpApiClient.setJsonBody(Cast.object(world.state.populateObject(step.rowsHash())))
    })

    /**
     * Setting json payload from fixture file
     */
    Given(/^(?:I )?set request json body from (.+)$/, (fixture) => {
        return world.fixtures.load(fixture).then((data) => {
            world.httpApiClient.setJsonBody(data)
        })
    })

    /**
     * Setting form data
     */
    Given(/^(?:I )?set request form body$/, (step) => {
        world.httpApiClient.setFormBody(Cast.object(world.state.populateObject(step.rowsHash())))
    })

    /**
     * Setting form data from fixture file
     */
    Given(/^(?:I )?set request form body from (.+)$/, (fixture) => {
        return world.fixtures.load(fixture).then((data) => {
            world.httpApiClient.setFormBody(data)
        })
    })

    /**
     * Setting multipart data from fixture file
     */
    Given(/^(?:I )?set request multipart body from (.+)$/, (fixture) => {
        return world.fixtures.load(fixture).then((data) => {
            world.httpApiClient.setMultipartBody(data)
        })
    })

    /**
     * Clearing body
     */
    Given(/^(?:I )?clear request body$/, () => {
        world.httpApiClient.clearBody()
    })

    /**
     * Setting query parameters
     */
    Given(/^(?:I )?set request query$/, (step) => {
        world.httpApiClient.setQuery(Cast.object(world.state.populateObject(step.rowsHash())))
    })

    /**
     * Pick a value from previous json response or header and set it to state
     */
    Given(/^(?:I )?pick response (json|header) (.+) as (.+)$/, (dataSource, path, key) => {
        const response = world.httpApiClient.getResponse()
        let data = dataSource !== 'header' ? response.body : response.headers

        world.state.set(key, getValue(data, path))
    })

    /**
     * Pick a value from previous json response or header and set it to state
     */
    Given(
        /^(?:I )?replace(?: placeholder)? (.+) in (.+) to ([^\s]+)(?: with regex options? (.+)?)?$/,
        (search, key, replaceValue, option) => {
            let newValue = world.state
                .get(key)
                .replace(new RegExp(search, option || undefined), replaceValue)
            world.state.set(key, newValue)
        },
    )

    /**
     * Enabling cookies
     */
    Given(/^(?:I )?enable cookies$/, () => {
        world.httpApiClient.enableCookies()
    })

    /**
     * Disabling cookies
     */
    Given(/^(?:I )?disable cookies$/, () => {
        world.httpApiClient.disableCookies()
    })

    /**
     * Setting a cookie from fixture file
     */
    Given(/^(?:I )?set cookie from (.+)$/, (fixture) => {
        return world.fixtures.load(fixture).then((cookie) => {
            world.httpApiClient.setCookie(cookie)
        })
    })

    /**
     * Clearing client request cookies
     */
    Given(/^(?:I )?clear request cookies$/, () => {
        world.httpApiClient.clearRequestCookies()
    })

    /**
     * Resetting the client's state
     */
    When(/^(?:I )?reset http client$/, () => {
        world.httpApiClient.reset()
    })

    /**
     * Performing a request
     */
    When(/^(?:I )?(GET|POST|PUT|DELETE|PATCH) (.+)$/, (method, path) => {
        return world.httpApiClient.makeRequest(method, world.state.populate(path), baseUrl)
    })

    /**
     * Dumping response body
     */
    When(/^(?:I )?dump response body$/, () => {
        const response = mustGetResponse(world.httpApiClient)
        console.log(inspect(response.body, { colors: true, depth: null }))
    })

    /**
     * Dumping response headers
     */
    When(/^(?:I )?dump response headers$/, () => {
        const response = mustGetResponse(world.httpApiClient)
        console.log(response.headers)
    })

    /**
     * Dumping response cookies
     */
    When(/^(?:I )?dump response cookies$/, () => {
        mustGetResponse(world.httpApiClient)
        console.log(world.httpApiClient.getCookies())
    })

    /**
     * Checking response status code
     */
    Then(/^response status code should be ([1-5][0-9][0-9])$/, (statusCode) => {
        const response = mustGetResponse(world.httpApiClient)
        expect(
            response.statusCode,
            `Expected status code to be: ${statusCode}, but found: ${response.statusCode}`,
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response status by message
     */
    Then(/^response status should be (.+)$/, (statusMessage) => {
        if (!STATUS_MESSAGES.includes(statusMessage.toLowerCase())) {
            throw new TypeError(`'${statusMessage}' is not a valid status message`)
        }

        const response = mustGetResponse(world.httpApiClient)
        const statusCode = findKey(STATUS_CODES, (msg) => msg.toLowerCase() === statusMessage)
        const currentStatusMessage = STATUS_CODES[`${response.statusCode}`] || response.statusCode

        expect(
            response.statusCode,
            `Expected status to be: '${statusMessage}', but found: '${currentStatusMessage.toLowerCase()}'`,
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response cookie is present|absent
     */
    Then(/^response should (not )?have an? (.+) cookie$/, (flag, key) => {
        const cookie = world.httpApiClient.getCookie(key)

        if (flag == undefined) {
            expect(cookie, `No cookie found for key '${key}'`).to.not.be.null
        } else {
            expect(cookie, `A cookie exists for key '${key}'`).to.be.null
        }
    })

    /**
     * Checking response cookie is|isn't secure
     */
    Then(/^response (.+) cookie should (not )?be secure$/, (key, flag) => {
        const cookie = world.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag == undefined) {
            expect(cookie.secure, `Cookie '${key}' is not secure`).to.be.true
        } else {
            expect(cookie.secure, `Cookie '${key}' is secure`).to.be.false
        }
    })

    /**
     * Checking response cookie httpOnly
     */
    Then(/^response (.+) cookie should (not )?be http only$/, (key, flag) => {
        const cookie = world.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag == undefined) {
            expect(cookie.httpOnly, `Cookie '${key}' is not http only`).to.be.true
        } else {
            expect(cookie.httpOnly, `Cookie '${key}' is http only`).to.be.false
        }
    })

    /**
     * Checking response cookie domain
     */
    Then(/^response (.+) cookie domain should (not )?be (.+)$/, (key, flag, domain) => {
        const cookie = world.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.null

        if (flag == undefined) {
            expect(
                cookie.domain,
                `Expected cookie '${key}' domain to be '${domain}', found '${cookie.domain}'`,
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
    Then(/^(?:I )?json response should (fully )?match$/, (fully, table) => {
        const response = mustGetResponse(world.httpApiClient)
        const { body } = response

        // We check the response has json content-type
        expect(response.headers['content-type']).to.contain('application/json')

        // First we populate spec values if it contains some placeholder
        const specifications = table.hashes().map((fieldSpec) => {
            const spec = fieldSpec.expression
                ? parseMatchExpression(fieldSpec.expression)
                : fieldSpec
            return {
                ...spec,
                value: world.state.populate(spec.value),
            }
        })

        assertObjectMatchSpec(body, specifications, !!fully)
    })

    /**
     * This definition verify that an array for a given path has the expected length
     */
    Then(
        /^(?:I )?should receive a collection of ([0-9]+) items?(?: for path )?(.+)?$/,
        (size, path) => {
            const response = mustGetResponse(world.httpApiClient)
            const { body } = response

            const array = path != undefined ? getValue(body, path) : body

            expect(array.length).to.be.equal(Number(size))
        },
    )

    /**
     * Verifies that response matches a fixture.
     **/
    Then(/^response should match fixture (.+)$/, (fixtureId) => {
        const response = mustGetResponse(world.httpApiClient)

        return world.fixtures.load(fixtureId).then((snapshot) => {
            expect(response.body).to.deep.equal(snapshot)
        })
    })

    /**
     * Checking response header.
     */
    Then(
        /^response header (.+) should (not )?(equal|contain|match) (.+)$/,
        (key, flag, comparator, expectedValue) => {
            const response = mustGetResponse(world.httpApiClient)
            const header = response.headers[key.toLowerCase()]

            expect(header, `Header '${key}' does not exist`).to.not.be.undefined

            let expectFn = expect(
                header,
                `Expected header '${key}' to ${
                    flag ? flag : ''
                }${comparator} '${expectedValue}', but found '${header}' which does${
                    flag ? '' : ' not'
                }`,
            ).to
            if (flag != undefined) {
                expectFn = expectFn.not
            }
            expectFn[comparator](comparator === 'match' ? new RegExp(expectedValue) : expectedValue)
        },
    )
}
