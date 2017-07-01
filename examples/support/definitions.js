'use strict'

const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given }) => {
    Given(/^(?:I )?define http mock from (.+)$/, function(fixture) {
    })
})