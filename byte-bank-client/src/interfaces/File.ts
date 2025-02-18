import { IBase } from "./Base";

export interface IFile extends IBase {
    name: string,
    description?: string,
    space?: string,
    owner?: string,
    parent?: string,
    mimeType: string,
    size: number,
    thumbnail?: string,
    key?: string,
    signedUrl?: string
}