'use strict'

const { defineSupportCode } = require('cucumber')
const { state, fixtures, httpApi, cli, fileSystem } = require('../../src')

defineSupportCode(({ setWorldConstructor }) => {
    setWorldConstructor(function() {
        state.extendWorld(this)
        fixtures.extendWorld(this)
        httpApi.extendWorld(this)
        cli.extendWorld(this)
        fileSystem.extendWorld(this)
    })
})

state.install(defineSupportCode)
fixtures.install(defineSupportCode)
httpApi.install()(defineSupportCode)
cli.install(defineSupportCode)
fileSystem.install(defineSupportCode)
