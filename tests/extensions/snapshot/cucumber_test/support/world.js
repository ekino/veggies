'use strict'

const { defineSupportCode } = require('cucumber')
const { state, httpApi, snapshot } = require('../../../../../src')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        httpApi.extendWorld(this)
        snapshot.extendWorld(this)
    })
})

state.install(defineSupportCode)
httpApi.install()(defineSupportCode)
snapshot.install(defineSupportCode)
