'use strict'

import querystring from 'querystring'
import { Given, Then, world } from '@cucumber/cucumber'
import nock from 'nock'
import { expect } from 'chai'

Given(
    /^I mock (?:(POST|GET) )?http call to forward request body for path (.+)$/,
    (method, path) => {
        if (method !== 'GET') {
            nock('http://fake.io')
                .post(path)
                .reply(200, (uri, requestBody) => requestBody)
                .defaultReplyHeaders({ location: 'http://fake.io/users/1' })
            return
        }

        nock('http://fake.io').get(path).reply(200)
    },
)

Then(/^response should match url encoded snapshot (.+)$/, (snapshotId) => {
    const httpResponse = world.httpApiClient.getResponse()
    expect(httpResponse).to.not.be.empty
    return world.fixtures.load(snapshotId).then((snapshot) => {
        expect(httpResponse.data).to.equal(querystring.stringify(snapshot))
    })
})
