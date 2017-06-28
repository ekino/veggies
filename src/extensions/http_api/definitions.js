'use strict'

const { expect } = require('chai')
const _ = require('lodash')

const Cast = require('../../cast')
const Helper = require('../../helper')

module.exports = ({ baseUrl = '' }) => ({ Given, When, Then }) => {
    Given(/^I set headers to$/, function(step) {
        this.httpApiClient.setHeaders(step.rowsHash())
    })

    Given(/^I set ([a-zA-Z0-9-]+) request header to (.*)$/, function(key, value) {
        this.httpApiClient.setHeader(key, value)
    })

    Given(/^I set request json body to$/, function(step) {
        this.httpApiClient.setJsonBody(step.rowsHash())
    })

    Given(/^I set request form body to$/, function(step) {
        this.httpApiClient.setFormBody(step.rowsHash())
    })

    Given(/^I set request query to$/, function(step) {
        this.httpApiClient.setQuery(step.rowsHash())
    })

    When(/^I reset http parameters$/, function() {
        this.httpApiClient.reset()
    })

    When(/^I (GET|POST|PUT|DELETE) (.*)$/, function(method, path) {
        return this.httpApiClient.makeRequest(method, path, baseUrl)
    })

    Then(/^I should receive a ([1-5][0-9][0-9]) HTTP status code$/, function(statusCode) {
        const httpResponse = this.httpApiClient.getResponse()
        expect(httpResponse).to.not.be.empty
        expect(httpResponse.statusCode).to.equal(Number(statusCode))
    })

    /**
     * This definition can be used for checking an object response.
     * It check that the properties of this object match with the expected properties
     * The columns header are | field | matcher | value |
     * You can define severals matchers :
     * - equals
     * - contains
     */
    Then(/^I should receive a json response (fully )?matching/, function(fully, table) {
        const response = this.httpApiClient.getResponse()
        const body = response.body

        const expectedProperties = Cast.objects(table.hashes())

        // We check the response has json content-type
        expect(response.headers['content-type']).to.contain('application/json')

        // We check response properties correspond to the expected response
        expectedProperties.forEach(propertyMatcher => {
            switch (propertyMatcher.matcher) {
                case 'contains':
                    expect(_.get(body, propertyMatcher.field)).to.contain(propertyMatcher.value)
                    break
                case 'equals':
                default:
                    expect(_.get(body, propertyMatcher.field)).to.be.equal(propertyMatcher.value)
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
    Then(/^I should receive a collection of (\d+) items for path '(.*)'/, function(itemsNumber, path) {
        const { body } = this.httpApiClient.getResponse()
        const array = _.get(body, path)

        expect(array.length).to.be.equal(Number(itemsNumber))
    })
}
