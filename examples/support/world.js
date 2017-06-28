'use strict'

const { defineSupportCode } = require('cucumber')
const { state, httpApi } = require('../../src')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        httpApi.extendWorld(this)
    })
})

state.install(defineSupportCode)
httpApi.install({})(defineSupportCode)
