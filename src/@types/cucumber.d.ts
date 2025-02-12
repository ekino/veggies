import { IWorld } from '@cucumber/cucumber'
import { State } from '../extensions/state/state.ts'

declare module '@cucumber/cucumber' {
    interface IWorld {
        state: State
    }
}
