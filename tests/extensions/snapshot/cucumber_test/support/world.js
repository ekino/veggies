'use strict'

const { setWorldConstructor } = require('cucumber')
const { state, httpApi, snapshot } = require('../../../../../src')

setWorldConstructor(function () {
    state.extendWorld(this)
    httpApi.extendWorld(this)
    snapshot.extendWorld(this)
})

state.install()
httpApi.install()
snapshot.install()
