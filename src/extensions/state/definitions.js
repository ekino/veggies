'use strict'

const _ = require('lodash')

const Cast = require('../../cast')

module.exports = ({ Given }) => {
    Given(/^I set state key (.*) to (.*)$/, (key, value) => {
        this.state[key] = _.template(Cast.value(value))()
    })

    Given(/^I clear state/, function() {
        this.state = {}
    })

}
