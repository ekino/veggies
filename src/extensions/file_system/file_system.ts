import fs, { type Stats } from 'node:fs'
import path from 'node:path'

export type FileSystemArgs = ConstructorParameters<typeof FileSystem>

class FileSystem {
    /**
     * Loads file content.
     */
    getFileContent = (
        cwd: string,
        file: string,
        encoding: BufferEncoding = 'utf8'
    ): Promise<string> =>
        new Promise((resolve, reject) => {
            fs.readFile(path.join(cwd, file), (err, data) => {
                if (err) return reject(err)
                resolve(data.toString(encoding))
            })
        })

    /**
     * Gets info about file/directory.
     */
    getFileInfo = (cwd: string, file: string): Promise<Stats | undefined> =>
        new Promise((resolve, reject) => {
            fs.stat(path.join(cwd, file), (err, stat) => {
                if (err) {
                    if (err.code === 'ENOENT') return resolve(undefined)
                    return reject(err)
                }

                resolve(stat)
            })
        })

    /**
     * Creates a directory.
     */
    createDirectory = (cwd: string, directory: string): void => {
        fs.mkdirSync(path.join(cwd, directory), { recursive: true })
    }

    /**
     * Removes a file or directory.
     */
    remove = (cwd: string, fileOrDirectory: string): void => {
        fs.rmSync(path.join(cwd, fileOrDirectory), { recursive: true, force: true })
    }
}

export default function (...args: FileSystemArgs): FileSystem {
    return new FileSystem(...args)
}

export { FileSystem }
