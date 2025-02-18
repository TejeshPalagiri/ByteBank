import { IBase } from "./Base";

export interface ISpace extends IBase {
    name: string,
    owner?: string,
    description?: string,
    size: number | 0
}