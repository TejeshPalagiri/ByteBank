import { Types } from "mongoose";

export interface IBase {
    createdBy: Types.ObjectId,
    updatedBy: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}