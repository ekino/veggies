'use strict'

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

module.exports = ({ Before }) => {
    Before(function(scenarioResult) {
        this.fixtures.reset()
        this.fixtures.setFeatureUri(scenarioResult.scenario.feature.uri)
    })
}
