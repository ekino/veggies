'use strict'

const { Before } = require('cucumber')

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

exports.install = () => {
    Before(function(scenarioInfos) {
        this.fixtures.setFeatureUri(scenarioInfos.sourceLocation.uri)
    })
}
