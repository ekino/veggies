'use strict'

const path = require('path')
const chalk = require('chalk')

const helper = require('./helper')
const fileSystem = require('../../../src/extensions/snapshot/fs')

const cwd = __dirname
const updateSnapshotFile = path.join(
    cwd,
    './cucumber_test/features/update_snapshot/__snapshots__/snapshot.feature.snap'
)
const updateSnapshotFileContent = fileSystem.getFileContent(updateSnapshotFile)
const removeSnapshotFile = path.join(
    cwd,
    './cucumber_test/features/remove_snapshot/__snapshots__/snapshot.feature.snap'
)
const removeSnapshotFileContent = fileSystem.getFileContent(removeSnapshotFile)

afterEach(function() {
    try {
        fileSystem.writeFileContent(updateSnapshotFile, updateSnapshotFileContent)
    } catch (err) {
        // ignore the error
    }

    try {
        fileSystem.writeFileContent(removeSnapshotFile, removeSnapshotFileContent)
    } catch (err) {
        // ignore the error
    }

    try {
        fileSystem.remove(path.join(cwd, './cucumber_test/features/create_snapshot/__snapshots__'))
    } catch (err) {
        // ignore the error
    }
})

test('Snapshot should report created snapshots', () => {
    const cucumberBin = path.join(process.cwd(), './node_modules/.bin/cucumber-js')
    let command = `${cucumberBin} --color --require cucumber_test/support cucumber_test/features`
    const cwd = __dirname

    command = `${command} --tags @create_snapshot`

    const expectedOutput = `Snapshots:   ${chalk.green('1 created, ')}1 total`

    return helper
        .runCommand({ cwd, command, env: {} })
        .then(({ exitCode, stdout, stderr }) => {
            expect(exitCode).toEqual(0)
            expect(stdout).toContain(expectedOutput)
        })
        .catch(err => {
            return Promise.reject(err)
        })
})

test('Snapshot module report updated snapshots and support the -u option', () => {
    const cucumberBin = path.join(process.cwd(), './node_modules/.bin/cucumber-js')
    let command = `${cucumberBin} --color -u --require cucumber_test/support cucumber_test/features`
    const cwd = __dirname

    command = `${command} --tags @update_snapshot`

    const expectedOutput = `Snapshots:   ${chalk.yellow('1 updated, ')}1 total`

    return helper
        .runCommand({ cwd, command, env: {} })
        .then(({ exitCode, stdout, stderr }) => {
            expect(exitCode).toEqual(0)
            expect(stdout).toContain(expectedOutput)
        })
        .catch(err => {
            return Promise.reject(err)
        })
})

test('Snapshot module report removed snapshots and support --cleanSnapshots option', () => {
    const cucumberBin = path.join(process.cwd(), './node_modules/.bin/cucumber-js')
    let command = `${cucumberBin} --color --cleanSnapshots --require cucumber_test/support cucumber_test/features`
    const cwd = __dirname

    command = `${command} --tags @remove_snapshot`

    const expectedOutput = `Snapshots:   ${chalk.red('1 removed, ')}1 total`

    return helper
        .runCommand({ cwd, command, env: {} })
        .then(({ exitCode, stdout, stderr }) => {
            expect(exitCode).toEqual(0)
            expect(stdout).toContain(expectedOutput)
        })
        .catch(err => {
            return Promise.reject(err)
        })
})

test('Snapshot module report created, updated and removed snapshots and support the --updateSnapshots option', () => {
    const cucumberBin = path.join(process.cwd(), './node_modules/.bin/cucumber-js')
    let command = `${cucumberBin} --color --cleanSnapshots --updateSnapshots --require cucumber_test/support cucumber_test/features`
    const cwd = __dirname

    command = `${command} --tags @snapshot`

    const expectedOutput = `Snapshots:   ${chalk.green('1 created, ')}${chalk.yellow(
        '2 updated, '
    )}${chalk.red('1 removed, ')}4 total`

    return helper
        .runCommand({ cwd, command, env: {} })
        .then(({ exitCode, stdout, stderr }) => {
            expect(exitCode).toEqual(0)
            expect(stdout).toContain(expectedOutput)
        })
        .catch(err => {
            return Promise.reject(err)
        })
})
