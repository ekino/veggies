'use strict'

const { defineSupportCode } = require('cucumber')
const { state, httpApi, cli } = require('../../src')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        httpApi.extendWorld(this)
        cli.extendWorld(this)
    })
})

state.install(defineSupportCode)
httpApi.install({})(defineSupportCode)
cli.install(defineSupportCode)
