'use strict'

const path = require('path')

/**
 * Registers hooks for the fixtures extension.
 *
 * @module extensions/fixtures/hooks
 */

module.exports = ({ Before }) => {
    Before(function(scenarioInfos) {
        if (scenarioInfos.sourceLocation) {
            this.fixtures.setFeatureUri(scenarioInfos.sourceLocation.uri)
        } else {
            const fullPath = scenarioInfos.scenario.feature.uri
            const relativePath = path.relative(process.cwd(), fullPath)
            this.fixtures.setFeatureUri(relativePath)
        }
    })
}
