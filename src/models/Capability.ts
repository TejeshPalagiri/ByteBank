import { model, Schema, Types } from "mongoose";
import { ITimestamp } from "./TimeStamp";

interface IPrevilege {
    [module: string]: {
        read: boolean,
        write: boolean,
        deleted: boolean
    }
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
        type: Types.Subdocument
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