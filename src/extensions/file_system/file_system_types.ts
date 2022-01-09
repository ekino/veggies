import { Stats } from 'fs-extra'

export interface FileSystem {
    getFileContent(cwd: string, file: string, encoding: BufferEncoding): Promise<string>
    getFileInfo(cwd: string, file: string): Promise<Stats | null>
    createDirectory(cwd: string, directory: string): Promise<void>
    remove(cwd: string, fileOrDirectory: string): Promise<void>
}
