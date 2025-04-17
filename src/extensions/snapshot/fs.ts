import fs, { type Stats } from 'node:fs'
import path from 'node:path'
import { getError } from '../../utils/index.js'

/**
 * Loads file content.
 */
export const getFileContent = (file: string, encoding: BufferEncoding = 'utf8'): string => {
    const data = fs.readFileSync(file)
    return data.toString(encoding)
}

export const writeFileContent = (
    file: string,
    content: string,
    { createDir = true } = {}
): void => {
    if (createDir) createDirectory(path.dirname(file))
    fs.writeFileSync(file, content)
}

/**
 * Gets info about file/directory.
 */
export const getFileInfo = (file: string): Stats | undefined => {
    try {
        return fs.statSync(file)
    } catch (err) {
        if (getError(err).code !== 'ENOENT') throw err
    }
    return undefined
}

/**
 * Creates a directory.
 */
export const createDirectory = (dir: string): void => {
    fs.mkdirSync(dir, { recursive: true })
}

/**
 * Removes a file or directory.
 */
export const remove = (fileOrDir: string): void => {
    fs.rmSync(fileOrDir, { recursive: true, force: true })
}
