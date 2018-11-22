'use strict'

const querystring = require('querystring')
const { Given, Then } = require('cucumber')
const nock = require('nock')
const { expect } = require('chai')

Given(/^I mock http call to forward request body for path (.+)$/, function(path) {
    nock('http://fake.io')
        .post(path)
        .reply(200, (uri, requestBody) => requestBody)
})

Then(/^response should match url encoded snapshot (.+)$/, function(snapshotId) {
    const httpResponse = this.httpApiClient.getResponse()
    expect(httpResponse).to.not.be.empty
    return this.fixtures.load(snapshotId).then(snapshot => {
        expect(httpResponse.body).to.equal(querystring.stringify(snapshot))
    })
})
