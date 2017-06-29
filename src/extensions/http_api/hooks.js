'use strict'

/**
 * Registers hooks for the http API extension.
 *
 * @module extensions/httpApi/hooks
 */

module.exports = ({ Before }) => {
    Before(function() {
        this.httpApiClient.reset()
    })
}
