'use strict'

const querystring = require('querystring')
const { Given, Then } = require('@cucumber/cucumber')
const nock = require('nock')
const { expect } = require('chai')

Given(/^I mock (?:(POST|GET) )?http call to forward request body for path (.+)$/, function (method,path) {
    if(method !== 'GET') {
        nock('http://fake.io')
        .post(path)
        .reply(200, (uri, requestBody) => requestBody)
            .defaultReplyHeaders({location: 'http://fake.io/users/1'})
        return
    }
    
    nock('http://fake.io')
        .get(path)
        .reply(200 )
})

Then(/^response should match url encoded snapshot (.+)$/, function (snapshotId) {
    const httpResponse = this.httpApiClient.getResponse()
    expect(httpResponse).to.not.be.empty
    return this.fixtures.load(snapshotId).then((snapshot) => {
        expect(httpResponse.body).to.equal(querystring.stringify(snapshot))
    })
})
