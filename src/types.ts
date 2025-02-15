import { AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
import { CookieJar } from 'tough-cookie'

export type PlainObject = Record<string, unknown>

export type Predicate<T> = (value: T | undefined) => boolean

export type Path = string | string[]

export type InterpolateOptions = {
    interpolate?: RegExp
}

export type VeggiesError = {
    code?: string
    stack?: string
    message: string
} & Record<string, unknown>

export type Method =
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'
    | 'purge'
    | 'PURGE'
    | 'link'
    | 'LINK'
    | 'unlink'
    | 'UNLINK'

export type CookieProperty = string | Record<string, unknown>

export type RequestHeaders =
    | (RawAxiosRequestHeaders &
          Partial<
              {
                  [Key in Method as Lowercase<Key>]: AxiosHeaders
              } & { common: AxiosHeaders }
          >)
    | AxiosHeaders

export type RequestOptions = AxiosRequestConfig & { jar?: CookieJar; headers: RequestHeaders }

export type RequestBody = string | string[][] | Record<string, string> | URLSearchParams

export type SnapshotContent = Record<string, string | undefined>

export type Scenario = {
    line: number
    name?: string
    prefix?: string
}

export type SnapshotOptions = {
    cleanSnapshots?: boolean
    updateSnapshots?: boolean
    preventSnapshotsCreation?: boolean
    snapshotsDirname?: string
    snapshotsFileExtension?: string
}

export type SnapshotFile = {
    file: string
    name: string
}
