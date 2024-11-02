import { model, Schema, Types } from "mongoose";
import { ITimestamp } from "./TimeStamp";

interface IPrevilege {
    key: string,
    read: boolean,
    write: boolean,
    deleted: boolean,
    edit: boolean
}

export interface ICapability extends ITimestamp {
    name: string,
    description: string,
    previlege: IPrevilege
}

const capabilityScheama = new Schema<ICapability>({
    name: {
        type: String,
        required: [true, "Please provide name of the capability."]
    },
    description: {
        type: String
    },
    previlege: {
        key: { type: String },
        read: { type: Boolean, required: true },
        write: { type: Boolean, required: true },
        delete: { type: Boolean, required: true },
        edit: { type: Boolean, required: true }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

export const Capability = model<ICapability>("Capability", capabilityScheama);