import { CoreOptions } from 'request'

export type MatchExpressionGroups = {
    [key: string]: string
}

export type Headers = {
    [key: string]: unknown
}

export type RequestOptions = CoreOptions & { uri: string }

export type HttpApiConfig = {
    baseUrl: string
    [props: string]: unknown
}
