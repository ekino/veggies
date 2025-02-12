'use strict'

import { setWorldConstructor } from '@cucumber/cucumber'
import { state, fixtures, httpApi, cli, fileSystem, snapshot } from '../../lib/esm/index.js'

setWorldConstructor(function () {
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
