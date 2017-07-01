'use strict'

const { defineSupportCode } = require('cucumber')
const { state, fixtures, httpApi, cli } = require('../../src')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        fixtures.extendWorld(this)
        httpApi.extendWorld(this)
        cli.extendWorld(this)
    })
})

state.install(defineSupportCode)
fixtures.install(defineSupportCode)
httpApi.install()(defineSupportCode)
cli.install(defineSupportCode)
