/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/FileSystem/FileSystem
 */

import path from 'path'
import { mkdirs, readFile, stat, Stats, remove as fsRemove } from 'fs-extra'

/**
 * Loads file content.
 *
 * @param {string} cwd               - Current Working Directory
 * @param {string} file              - File name
 * @param {string} [encoding='utf8'] - Content encoding
 * @return {Promise.<string>} File content
 */
export const getFileContent = (
    cwd: string,
    file: string,
    encoding: BufferEncoding = 'utf8'
): Promise<string> =>
    new Promise((resolve, reject) => {
        readFile(path.join(cwd, file), (err, data) => {
            if (err) return reject(err)
            resolve(data.toString(encoding))
        })
    })

/**
 * Gets info about file/directory.
 *
 * @param {string} cwd  - Current Working Directory
 * @param {string} file - File name
 * @return {Promise.<fs.Stats|null>} File/directory info or null if file/directory does not exist
 */
export const getFileInfo = (cwd: string, file: string): Promise<Stats | null> =>
    new Promise((resolve, reject) => {
        stat(path.join(cwd, file), (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') return resolve(null)
                return reject(err)
            }

            resolve(stats)
        })
    })

/**
 * Creates a directory.
 *
 * @param {string} cwd       - Current Working Directory
 * @param {string} directory - Directory name
 * @return {Promise.<boolean>}
 */
export const createDirectory = (cwd: string, directory: string): Promise<void> =>
    mkdirs(path.join(cwd, directory))

/**
 * Removes a file or directory.
 *
 * @param {string} cwd             - Current Working Directory
 * @param {string} fileOrDirectory - File or directory name
 * @return {Promise.<boolean>}
 */
export const remove = (cwd: string, fileOrDirectory: string): Promise<void> =>
    fsRemove(path.join(cwd, fileOrDirectory))
