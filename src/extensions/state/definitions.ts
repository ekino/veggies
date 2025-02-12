import { Given, When, world } from '@cucumber/cucumber'
import * as Cast from '../../core/cast.js'

export const install = (): void => {
    Given(/^(?:I )?set state (.+) to (.+)$/, (key, value) => {
        world.state.set(key, Cast.getCastedValue(value))
    })

    When(/^(?:I )?clear state$/, () => {
        world.state.clear()
    })

    When(/^(?:I )?dump state$/, () => {
        console.log(world.state.dump())
    })
}
