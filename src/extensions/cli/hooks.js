'use strict'

/**
 * Registers hooks for the CLI extension.
 *
 * @module extensions/Cli/hooks
 */

module.exports = ({ Before }) => {
    Before(function() {
        this.cli.reset()
    })
}
