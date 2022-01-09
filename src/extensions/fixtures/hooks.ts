import { Before } from '@cucumber/cucumber'
import { fixtures } from './fixtures'

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export const install = (): void => {
    Before(function (scenarioInfos) {
        fixtures.setFeatureUri(scenarioInfos.gherkinDocument.uri)
    })
}
