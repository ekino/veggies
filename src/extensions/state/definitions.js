'use strict'

const Cast = require('../../cast')

module.exports = ({ Given, When }) => {
    Given(/^(?:I )?set state (.+) to (.+)$/, (key, value) => {
        this.state.set(key, Cast.value(value))
    })

    When(/^(?:I )?clear state$/, function() {
        this.state.clear()
    })

    When(/^(?:I )?dump state$/, function() {
        console.log(this.state.dump()) // eslint-disable-line no-console
    })
}
