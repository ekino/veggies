import { stub } from 'sinon'
import { hasArg, hasOneArgOf } from '../../../src/utils/command_line.js'

const argvStub = stub(process, 'argv')

describe('utils > command_line', () => {
    beforeAll(() => {
        argvStub.value(['--argOne', '-t', '--three'])
    })

    afterEach(() => argvStub.resetHistory())
    afterAll(() => argvStub.restore())

    test('hasArg should return true when the arg is found', () => {
        expect(hasArg('-t')).toBe(true)
    })

    test('hasArg should return false when the arg is not found', () => {
        expect(hasArg('--missing')).toBe(false)
    })

    test('hasOneArgOf should return true when at least an arg is found', () => {
        expect(hasOneArgOf(['--argOne', '--notFound'])).toBe(true)
    })

    test('hasOneArgOf should return false when no args are found', () => {
        expect(hasOneArgOf(['--missing', '--notFound'])).toBe(false)
    })
})
