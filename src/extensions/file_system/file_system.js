'use strict'

/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/FileSystem/FileSystem
 */

import path from 'node:path'
import fs from 'node:fs'

/**
 * Loads file content.
 *
 * @param {string} cwd               - Current Working Directory
 * @param {string} file              - File name
 * @param {string} [encoding='utf8'] - Content encoding
 * @return {Promise.<string>} File content
 */
export const getFileContent = (cwd, file, encoding = 'utf8') =>
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
export const getFileInfo = (cwd, file) =>
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
export const createDirectory = (cwd, directory) =>
    fs.mkdirSync(path.join(cwd, directory), { recursive: true })

/**
 * Removes a file or directory.
 *
 * @param {string} cwd             - Current Working Directory
 * @param {string} fileOrDirectory - File or directory name
 * @return {Promise.<boolean>}
 */
export const remove = (cwd, fileOrDirectory) =>
    fs.rmSync(path.join(cwd, fileOrDirectory), { recursive: true, force: true })
