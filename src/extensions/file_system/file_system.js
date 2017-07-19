'use strict'

/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/FileSystem/FileSystem
 */

const path = require('path')
const fs = require('fs-extra')

/**
 * Loads file content.
 *
 * @param {string} cwd               - Current Working Directory
 * @param {string} file              - File name
 * @param {string} [encoding='utf8'] - Content encoding
 * @return {Promise.<string>} File content
 */
exports.getFileContent = (cwd, file, encoding = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.readFile(path.join(cwd, file), (err, data) => {
            if (err) return reject(err)
            resolve(data.toString(encoding))
        })
    })

/**
 * Gets info about file/directory.
 *
 * @param {string} cwd  - Current Working Directory
 * @param {string} file - File name
 * @return {Promise.<fs.Stat|null>} File/directory info or null if file/directory does not exist
 */
exports.getFileInfo = (cwd, file) =>
    new Promise((resolve, reject) => {
        fs.stat(path.join(cwd, file), (err, stat) => {
            if (err) {
                if (err.code === 'ENOENT') return resolve(null)
                return reject(err)
            }

            resolve(stat)
        })
    })

/**
 * Creates a directory.
 *
 * @param {string} cwd       - Current Working Directory
 * @param {string} directory - Directory name
 * @return {Promise.<boolean>}
 */
exports.createDirectory = (cwd, directory) => fs.mkdirs(path.join(cwd, directory))

/**
 * Removes a file or directory.
 *
 * @param {string} cwd             - Current Working Directory
 * @param {string} fileOrDirectory - File or directory name
 * @return {Promise.<boolean>}
 */
exports.remove = (cwd, fileOrDirectory) => fs.remove(path.join(cwd, fileOrDirectory))
