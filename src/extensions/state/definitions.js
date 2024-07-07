'use strict'

import { Given, When } from '@cucumber/cucumber'
import * as Cast from '../../core/cast.js'

export const install = () => {
    Given(/^(?:I )?set state (.+) to (.+)$/, function (key, value) {
        this.state.set(key, Cast.getCastedValue(value))
    })

    When(/^(?:I )?clear state$/, function () {
        this.state.clear()
    })

    When(/^(?:I )?dump state$/, function () {
        console.log(this.state.dump())
    })
}
