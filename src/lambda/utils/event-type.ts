export type FunctionEvent = {
    "path": string,
    "httpMethod": string,
    "headers": {[key: string]: any}
    "queryStringParameters": {[key: string]: any}
    "body": string
    "isBase64Encoded": boolean
    [key: string]: any
}