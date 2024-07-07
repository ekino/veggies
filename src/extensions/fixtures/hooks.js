'use strict'

import { Before } from '@cucumber/cucumber'

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

export const install = () => {
    Before(function (scenarioInfos) {
        this.fixtures.setFeatureUri(scenarioInfos.gherkinDocument.uri)
    })
}
