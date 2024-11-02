import { Types } from "mongoose";

export interface IBase {
    _id: string | Types.ObjectId,
    createdBy: Types.ObjectId,
    updatedBy: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean
}