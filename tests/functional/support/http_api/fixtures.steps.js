import * as assert from 'node:assert/strict'
import fs from 'node:fs'
import querystring from 'node:querystring'
import { Given, Then, world } from '@cucumber/cucumber'
import nock from 'nock'

Given(
    /^I mock (?:(POST|GET) )?http call to forward request body for path (.+)$/,
    (method, path) => {
        if (method !== 'GET') {
            nock('https://fake.io')
                .post(path)
                .reply(200, (_, requestBody) => requestBody)
                .defaultReplyHeaders({ location: 'https://fake.io/users/1' })
            return
        }

        nock('https://fake.io').get(path).reply(200)
    }
)

Given(/^I mock POST http call to forward request json body for path (.+)/, (path) => {
    nock('http://mysite.com/api/v1')
        .post(path)
        .reply(200, (_, body) => body.response.jsonBody.data)
})

Given(
    /^I mock GET http call from (.+) to forward request json body for path (.+)$/,
    (json, path) => {
        const file = `tests/functional/features/${json}`
        const response = readJsonFile(file).response
        nock('http://mysite.com/api/v1')
            .get(path)
            .reply(response.status, response.jsonBody.data, response.headers)
    }
)

Then(/^response should match url encoded snapshot (.+)$/, (snapshotId) => {
    const httpResponse = world.httpApiClient.getResponse()
    assert.ok(response !== undefined && response !== null)
    return world.fixtures.load(snapshotId).then((snapshot) => {
        assert.strictEqual(httpResponse?.data, querystring.strinfigy(snapshot))
    })
})

const readJsonFile = (filePath) => JSON.parse(fs.readFileSync(filePath))
