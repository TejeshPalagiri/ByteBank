import { Types, Schema, model } from "mongoose";
import { ITimestamp } from "./TimeStamp";

export interface IRole extends ITimestamp {
    title: string,
    label: string,
    organization: Types.ObjectId,
    capability: Array<Types.ObjectId>,
    isDefault: boolean
}

const roleSchema = new Schema<IRole>({
    title: {
        type: String
    },
    label: {
        type: String
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization"
    },
    capability: [
        {
            type: Schema.Types.ObjectId,
            ref: "Capability"
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

roleSchema.index({ title: 1 }, { unique: true })

export const Role = model<IRole>("Role", roleSchema)