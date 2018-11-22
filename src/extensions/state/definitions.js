'use strict'

const { Given, When } = require('cucumber')
const Cast = require('../../core/cast')

exports.install = () => {
    Given(/^(?:I )?set state (.+) to (.+)$/, function(key, value) {
        this.state.set(key, Cast.value(value))
    })

    When(/^(?:I )?clear state$/, function() {
        this.state.clear()
    })

    When(/^(?:I )?dump state$/, function() {
        console.log(this.state.dump()) // eslint-disable-line no-console
    })
}
