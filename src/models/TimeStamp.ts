import { Types } from "mongoose";

export interface ITimestamp {
    _id: string | Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean
}