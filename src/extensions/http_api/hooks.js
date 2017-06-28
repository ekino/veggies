'use strict'

module.exports = ({ Before }) => {
    Before(function() {
        this.httpApiClient.reset()
    })
}
