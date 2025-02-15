import { STATUS_CODES } from 'node:http'
import { inspect } from 'node:util'
import { type DataTable, Given, Then, When, world } from '@cucumber/cucumber'
import { expect } from 'chai'

import type { AxiosResponse } from 'axios'
import { assertObjectMatchSpec } from '../../core/assertions.js'
import * as Cast from '../../core/cast.js'
import type { CastedValue, CookieProperty, RequestBody, RequestHeaders } from '../../types.js'
import { findKey, getValue, isNullsy, isString } from '../../utils/index.js'
import type { HttpApiClient } from './client.js'
import { parseMatchExpression } from './utils.js'

const STATUS_MESSAGES = Object.values(STATUS_CODES)
    .map((code) => (code ? code.toLowerCase() : undefined))
    .filter((code) => !!code)

/**
 * Ensures there's a response available and returns it.
 *
 */
const mustGetResponse = (client: HttpApiClient) => {
    const response = client.getResponse()
    expect(response, 'No response available').to.not.be.empty

    return response
}

export const install = ({ baseUrl = '' } = {}): void => {
    /**
     * Setting http headers
     */
    Given(/^(?:I )?set request headers$/, (step: DataTable): void => {
        world.httpApiClient.setHeaders(
            Cast.getCastedObject(world.state.populateObject(step.rowsHash())) as RequestHeaders
        )
    })

    /**
     * Setting http option followRedirect to false
     */
    Given(/^(?:I )?do not follow redirect$/, (): void => {
        world.httpApiClient.setFollowRedirect(false)
    })

    /**
     * Setting http option followRedirect to true
     */
    Given(/^(?:I )?follow redirect$/, (): void => {
        world.httpApiClient.setFollowRedirect(true)
    })

    /**
     * Assign http headers
     * The difference from "set request headers" is that "set" set the whole headers object
     * "assign" replace or set the given headers, keeping untouched the ones already set
     */
    Given(/^(?:I )?assign request headers$/, (step: DataTable): void => {
        const headers = Cast.getCastedObject(world.state.populateObject(step.rowsHash()))
        for (const [key, value] of Object.entries(headers)) {
            world.httpApiClient.setHeader(key, value)
        }
    })

    /**
     * Setting a single http header
     */
    Given(
        /^(?:I )?set ([a-zA-Z0-9-_]+) request header to (.+)$/,
        (key: string, value: string): void => {
            world.httpApiClient.setHeader(key, Cast.getCastedValue(world.state.populate(value)))
        }
    )

    /**
     * Clearing headers
     */
    Given(/^(?:I )?clear request headers/, (): void => {
        world.httpApiClient.clearHeaders()
    })

    /**
     * Setting json payload
     */
    Given(/^(?:I )?set request json body$/, (step: DataTable): void => {
        world.httpApiClient.setJsonBody(
            Cast.getCastedObject(world.state.populateObject(step.rowsHash())) as RequestBody
        )
    })

    /**
     * Setting json payload from fixture file
     */
    Given(/^(?:I )?set request json body from (.+)$/, (fixture: string) => {
        return world.fixtures.load(fixture).then((data: RequestBody) => {
            world.httpApiClient.setJsonBody(data)
        })
    })

    /**
     * Setting form data
     */
    Given(/^(?:I )?set request form body$/, (step: DataTable): void => {
        world.httpApiClient.setFormBody(
            Cast.getCastedObject(world.state.populateObject(step.rowsHash())) as RequestBody
        )
    })

    /**
     * Setting form data from fixture file
     */
    Given(/^(?:I )?set request form body from (.+)$/, (fixture: string) => {
        return world.fixtures.load(fixture).then((data: RequestBody) => {
            world.httpApiClient.setFormBody(data)
        })
    })

    /**
     * Setting multipart data from fixture file
     */
    Given(/^(?:I )?set request multipart body from (.+)$/, (fixture: string) => {
        return world.fixtures.load(fixture).then((data: RequestBody) => {
            world.httpApiClient.setMultipartBody(data)
        })
    })

    /**
     * Clearing body
     */
    Given(/^(?:I )?clear request body$/, (): void => {
        world.httpApiClient.clearBody()
    })

    /**
     * Setting query parameters
     */
    Given(/^(?:I )?set request query$/, (step): void => {
        world.httpApiClient.setQuery(
            Cast.getCastedObject(world.state.populateObject(step.rowsHash()))
        )
    })

    /**
     * Pick a value from previous json response or header and set it to state
     */
    Given(
        /^(?:I )?pick response (json|header) (.+) as (.+)$/,
        (dataSource: string, path: string, key: string): void => {
            const response = world.httpApiClient.getResponse()
            const data = dataSource !== 'header' ? response?.data : response?.headers

            world.state.set(key, getValue(data, path))
        }
    )

    /**
     * Pick a value from previous json response or header and set it to state
     */
    Given(
        /^(?:I )?replace(?: placeholder)? (.+) in (.+) to ([^\s]+)(?: with regex options? (.+)?)?$/,
        (search: string, key: string, replaceValue: string, option: string): void => {
            const value = world.state.get(key)
            const newValue = isString(value)
                ? value.replace(new RegExp(search, option || undefined), replaceValue)
                : (value as CastedValue)
            world.state.set(key, newValue)
        }
    )

    /**
     * Enabling cookies
     */
    Given(/^(?:I )?enable cookies$/, (): void => {
        world.httpApiClient.enableCookies()
    })

    /**
     * Disabling cookies
     */
    Given(/^(?:I )?disable cookies$/, (): void => {
        world.httpApiClient.disableCookies()
    })

    /**
     * Setting a cookie from fixture file
     */
    Given(/^(?:I )?set cookie from (.+)$/, (fixture: string) => {
        return world.fixtures.load(fixture).then((cookie: CookieProperty) => {
            world.httpApiClient.setCookie(cookie)
        })
    })

    /**
     * Clearing client request cookies
     */
    Given(/^(?:I )?clear request cookies$/, (): void => {
        world.httpApiClient.clearRequestCookies()
    })

    /**
     * Resetting the client's state
     */
    When(/^(?:I )?reset http client$/, (): void => {
        world.httpApiClient.reset()
    })

    /**
     * Performing a request
     */
    When(/^(?:I )?(GET|POST|PUT|DELETE|PATCH) (.+)$/, (method: string, path: string) => {
        return world.httpApiClient.makeRequest(method, world.state.populate(path), baseUrl)
    })

    /**
     * Dumping response body
     */
    When(/^(?:I )?dump response body$/, (): void => {
        const response = mustGetResponse(world.httpApiClient)
        console.log(inspect(response?.data, { colors: true, depth: null }))
    })

    /**
     * Dumping response headers
     */
    When(/^(?:I )?dump response headers$/, (): void => {
        const response = mustGetResponse(world.httpApiClient)
        console.log(response?.headers)
    })

    /**
     * Dumping response cookies
     */
    When(/^(?:I )?dump response cookies$/, (): void => {
        mustGetResponse(world.httpApiClient)
        console.log(world.httpApiClient.getCookies())
    })

    /**
     * Checking response status code
     */
    Then(/^response status code should be ([1-5][0-9][0-9])$/, (statusCode: number): void => {
        const response = mustGetResponse(world.httpApiClient)
        expect(
            response?.status,
            `Expected status code to be: ${statusCode}, but found: ${response?.status}`
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response status by message
     */
    Then(/^response status should be (.+)$/, (statusMessage: string): void => {
        if (!STATUS_MESSAGES.includes(statusMessage.toLowerCase())) {
            throw new TypeError(`'${statusMessage}' is not a valid status message`)
        }

        const response = mustGetResponse(world.httpApiClient)
        const statusCode = findKey(STATUS_CODES, (msg) => msg?.toLowerCase() === statusMessage)
        const currentStatusMessage = STATUS_CODES[`${response?.status}`] || response?.status

        expect(
            response?.status,
            `Expected status to be: '${statusMessage}', but found: '${currentStatusMessage}'`
        ).to.equal(Number(statusCode))
    })

    /**
     * Checking response cookie is present|absent
     */
    Then(
        /^response should (not )?have an? (.+) cookie$/,
        (flag: string | undefined, key: string): void => {
            const cookie = world.httpApiClient.getCookie(key)

            if (isNullsy(flag)) {
                expect(cookie, `No cookie found for key '${key}'`).to.not.be.undefined
            } else {
                expect(cookie, `A cookie exists for key '${key}'`).to.be.undefined
            }
        }
    )

    /**
     * Checking response cookie is|isn't secure
     */
    Then(/^response (.+) cookie should (not )?be secure$/, (key: string, flag?: string): void => {
        const cookie = world.httpApiClient.getCookie(key)
        expect(cookie, `No cookie found for key '${key}'`).to.not.be.undefined

        if (isNullsy(flag)) {
            expect(cookie?.secure, `Cookie '${key}' is not secure`).to.be.true
        } else {
            expect(cookie?.secure, `Cookie '${key}' is secure`).to.be.false
        }
    })

    /**
     * Checking response cookie httpOnly
     */
    Then(
        /^response (.+) cookie should (not )?be http only$/,
        (key: string, flag?: string): void => {
            const cookie = world.httpApiClient.getCookie(key)
            expect(cookie, `No cookie found for key '${key}'`).to.not.be.undefined

            if (isNullsy(flag)) {
                expect(cookie?.httpOnly, `Cookie '${key}' is not http only`).to.be.true
            } else {
                expect(cookie?.httpOnly, `Cookie '${key}' is http only`).to.be.false
            }
        }
    )

    /**
     * Checking response cookie domain
     */
    Then(
        /^response (.+) cookie domain should (not )?be (.+)$/,
        (key: string, flag: string | undefined, domain: string): void => {
            const cookie = world.httpApiClient.getCookie(key)
            expect(cookie, `No cookie found for key '${key}'`).to.not.be.undefined

            if (isNullsy(flag)) {
                expect(
                    cookie?.domain,
                    `Expected cookie '${key}' domain to be '${domain}', found '${cookie?.domain}'`
                ).to.equal(domain)
            } else {
                expect(cookie?.domain, `Cookie '${key}' domain is '${domain}'`).to.not.equal(domain)
            }
        }
    )

    /**
     * This definition can be used for checking an object response.
     * It check that the properties of this object match with the expected properties
     * The columns header are | field | matcher | value |
     * @see Assertions.assertObjectMatchSpec
     */
    Then(
        /^(?:I )?json response should (fully )?match$/,
        (fully: string, table: DataTable): void => {
            const response = mustGetResponse(world.httpApiClient)
            const data = response?.data

            // We check the response has json content-type
            expect(response?.headers['content-type']).to.contain('application/json')

            // First we populate spec values if it contains some placeholder
            const specifications = table.hashes().map((fieldSpec) => {
                const spec = fieldSpec['expression']
                    ? parseMatchExpression(fieldSpec['expression'])
                    : fieldSpec
                return {
                    ...spec,
                    value: spec?.['value'] ? world.state.populate(spec['value']) : undefined,
                }
            })

            assertObjectMatchSpec(data, specifications, !!fully)
        }
    )

    /**
     * This definition verify that an array for a given path has the expected length
     */
    Then(
        /^(?:I )?should receive a collection of ([0-9]+) items?(?: for path )?(.+)?$/,
        (size: number, path?: string): void => {
            const response = mustGetResponse(world.httpApiClient)
            const data = response?.data

            const array = !isNullsy(path) ? getValue(data, path) : data

            expect(array.length).to.be.equal(Number(size))
        }
    )

    /**
     * Verifies that response matches a fixture.
     **/
    Then(/^response should match fixture (.+)$/, (fixtureId: string): void => {
        const response = mustGetResponse(world.httpApiClient)

        world.fixtures.load(fixtureId).then((snapshot: AxiosResponse) => {
            expect(response?.data).to.deep.equal(snapshot)
        })
    })

    /**
     * Checking response header.
     */
    Then(
        /^response header (.+) should (not )?(equal|contain|match) (.+)$/,
        (
            key: string,
            flag: string | undefined,
            comparator: string,
            expectedValue: string
        ): void => {
            const response = mustGetResponse(world.httpApiClient)
            const header = response?.headers[key.toLowerCase()]

            expect(header, `Header '${key}' does not exist`).to.not.be.undefined

            let expectFn = expect(
                header,
                `Expected header '${key}' to ${
                    flag ? flag : ''
                }${comparator} '${expectedValue}', but found '${header}' which does${
                    flag ? '' : ' not'
                }`
            ).to
            if (!isNullsy(flag)) {
                expectFn = expectFn.not
            }

            //@ts-ignore
            expectFn[comparator](comparator === 'match' ? new RegExp(expectedValue) : expectedValue)
        }
    )
}
