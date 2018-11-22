'use strict'

const { setWorldConstructor } = require('cucumber')
const { state, fixtures, httpApi, cli, fileSystem, snapshot } = require('../../src')

setWorldConstructor(function() {
    state.extendWorld(this)
    fixtures.extendWorld(this)
    httpApi.extendWorld(this)
    cli.extendWorld(this)
    fileSystem.extendWorld(this)
    snapshot.extendWorld(this)
})

state.install()
fixtures.install()
httpApi.install()
cli.install()
fileSystem.install()
snapshot.install()
