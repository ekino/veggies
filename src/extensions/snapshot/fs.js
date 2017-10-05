'use strict'

/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/snapshot/FileSystem
 */

const path = require('path')
const fs = require('fs-extra')

/**
 * Loads file content.
 *
 * @param {string} file              - File path
 * @param {string} [encoding='utf8'] - Content encoding
 * @return {string} File content
 */
exports.getFileContent = (file, encoding = 'utf8') => {
    const data = fs.readFileSync(file)
    return data.toString(encoding)
}

/**
 *
 * @param {string} file                             - File path
 * @param {string} content                          - Content to write in the file
 * @param {object} [options]                        - Options
 * @param {boolean} [options.createDir = true]      - Create path dir if it doesn't exists
 */
exports.writeFileContent = (file, content, { createDir = true } = {}) => {
    if (createDir) exports.createDirectory(path.dirname(file))
    return fs.writeFileSync(file, content)
}

/**
 * Gets info about file/directory.
 *
 * @param {string} file - File path
 * @return {fs.Stat|null} File/directory info or null if file/directory does not exist
 */
exports.getFileInfo = file => {
    let result = null
    try {
        result = fs.statSync(file)
    } catch (err) {
        if (err.code !== 'ENOENT') throw err
    }

    return result
}

/**
 * Creates a directory.
 *
 * @param {string} dir - directory path
 * @return {boolean}
 */
exports.createDirectory = dir => {
    return fs.mkdirsSync(dir)
}

/**
 * Removes a file or directory.
 *
 * @param {string} fileOrDirectory - File or directory path
 * @return {boolean}
 */
exports.remove = fileOrDir => {
    return fs.removeSync(fileOrDir)
}
