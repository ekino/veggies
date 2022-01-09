/**
 * The FileSystem helper used by the FileSystem extension.
 *
 * @module extensions/snapshot/FileSystem
 */

import path from 'path'
import { Stats, readFileSync, statSync, writeFileSync, mkdirsSync, removeSync } from 'fs-extra'

/**
 * Loads file content.
 *
 * @param {string} file              - File path
 * @param {string} [encoding='utf8'] - Content encoding
 * @return {string} File content
 */
export const getFileContent = (file: string, encoding: BufferEncoding = 'utf8'): string => {
    const data = readFileSync(file)
    return data.toString(encoding)
}

/**
 *
 * @param {string} file                             - File path
 * @param {string} content                          - Content to write in the file
 * @param {object} [options]                        - Options
 * @param {boolean} [options.createDir = true]      - Create path dir if it doesn't exists
 */
export const writeFileContent = (
    file: string,
    content: string,
    { createDir = true } = {}
): void => {
    if (createDir) createDirectory(path.dirname(file))
    return writeFileSync(file, content)
}

/**
 * Gets info about file/directory.
 *
 * @param {string} file - File path
 * @return {Stats|null} File/directory info or null if file/directory does not exist
 */
export const getFileInfo = (file: string): Stats | undefined => {
    try {
        return statSync(file)
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err.code !== 'ENOENT') throw err
    }
}

/**
 * Creates a directory.
 *
 * @param {string} dir - directory path
 */
export const createDirectory = (dir: string): void => {
    return mkdirsSync(dir)
}

/**
 * Removes a file or directory.
 *
 * @param {string} fileOrDir - File or directory path
 */
export const remove = (fileOrDir: string): void => {
    return removeSync(fileOrDir)
}
