import * as assert from 'node:assert/strict'
import querystring from 'node:querystring'
import { Given, Then, world } from '@cucumber/cucumber'
import nock from 'nock'

Given(
    /^I mock (?:(POST|GET) )?http call to forward request body for path (.+)$/,
    (method, path) => {
        if (method !== 'GET') {
            nock('https://fake.io')
                .post(path)
                .reply(200, (_uri, requestBody) => requestBody)
                .defaultReplyHeaders({ location: 'https://fake.io/users/1' })
            return
        }

        nock('https://fake.io').get(path).reply(200)
    }
)

Then(/^response should match url encoded snapshot (.+)$/, (snapshotId) => {
    const httpResponse = world.httpApiClient.getResponse()
    assert.ok(httpResponse !== undefined && httpResponse !== null)
    return world.fixtures.load(snapshotId).then((snapshot) => {
        assert.strictEqual(httpResponse?.data, querystring.stringify(snapshot))
    })
})
