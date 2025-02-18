import { IBase } from "./Base";

export interface IFolder extends IBase {
    name: string,
    description?: string,
    space?: string,
    parent?: string,
    owner?: string,
    path?: string // can be empty or the id of parent
}