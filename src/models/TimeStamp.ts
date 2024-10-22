import { Types } from "mongoose";

export interface ITimestamp {
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean
}