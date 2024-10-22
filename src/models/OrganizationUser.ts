import { model, Schema, Types } from "mongoose";
import { IBase } from "./Base";

export enum OrganizationUserStatus {
    IN_ACTIVE = 0,
    ACTIVE = 1,
    ARCHIVED = 2
}

export interface IOrganizationUser extends IBase {
    organization: Types.ObjectId,
    user: Types.ObjectId,
    role: Types.ObjectId,
    extraCapabilities: Array<Types.ObjectId>,
    status: OrganizationUserStatus
}

const organizationUserSchema = new Schema<IOrganizationUser>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        enum: {
            values: [OrganizationUserStatus.ACTIVE, OrganizationUserStatus.IN_ACTIVE, OrganizationUserStatus.ARCHIVED],
            message: "Please provide a valid user status."
        },
        default: OrganizationUserStatus.ACTIVE
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization"
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role"
    },
    extraCapabilities: [
        {
            type: Schema.Types.ObjectId,
            ref: "Capability"
        }
    ]
})

organizationUserSchema.index({ user: 1, organization: 1 }, { unique: true });

export const OrganizationUser = model<IOrganizationUser>("OrganizationUser", organizationUserSchema);