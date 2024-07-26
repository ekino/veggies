'use strict'

import { setWorldConstructor } from '@cucumber/cucumber'
import { cli, snapshot, state } from '../../../src/index.js'

setWorldConstructor(function () {
    state.extendWorld(this)
    cli.extendWorld(this)
    snapshot.extendWorld(this)
})

state.install()
cli.install()
snapshot.install()
