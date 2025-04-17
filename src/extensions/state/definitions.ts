import { Given, When, world } from '@cucumber/cucumber'
import * as Cast from '../../core/cast.js'

export const install = (): void => {
    Given(/^(?:I )?set state (.+) to (.+)$/, (key: string, value: unknown): void => {
        world.state.set(key, Cast.getCastedValue(value))
    })

    When(/^(?:I )?clear state$/, (): void => {
        world.state.clear()
    })

    When(/^(?:I )?dump state$/, (): void => {
        console.log(world.state.dump())
    })
}
