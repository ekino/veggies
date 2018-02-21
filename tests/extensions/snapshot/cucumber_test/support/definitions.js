'use strict'

const nock = require('nock')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given }) => {
    Given(/^I mock http call to forward request body for path (.+)$/, function(path) {
        nock('http://fake.io')
            .post(path)
            .reply(200, (uri, requestBody) => requestBody)
    })
})
