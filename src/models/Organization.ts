import { model, Schema } from "mongoose"
import { ITimestamp } from "./TimeStamp"

export enum OrganizationStatus {
    IN_ACTIVE = 0,
    ACTIVE = 1,
    BLOCKED = 2
}

export interface IOrganization extends ITimestamp {
    name: string,
    domain: string // Where this is used for validating the email,
    address: {
        state: string,
        country: string,
        zipCode: string,
        landmark: string,
        lat: string,
        long: string
    },
    email: string,
    phone: string,
    phoneCode: string,
    status: OrganizationStatus,
    code: string,
    website: string
}

const organizationSchema = new Schema<IOrganization>({
    name: {
        type: String,
        required: [true, "Please provide organization name."]
    },
    code: {
        type: String,
        required: [true, "Please provide company code."],
        unique: true
    },
    domain: {
        type: String
    },
    address: {
        state: {
            type: String
        },
        country: {
            type: String
        },
        zipCode: {
            type: String
        },
        landmark: {
            type: String
        },
        lat: {
            type: String
        },
        long: {
            type: String
        }
    },
    email: {
        type: String,
        required: [true, "Please provide organization contact email"]
    },
    phone: {
        type: String
    },
    status: {
        type: Number,
        enum: {
            values: [OrganizationStatus.ACTIVE, OrganizationStatus.BLOCKED, OrganizationStatus.IN_ACTIVE],
            message: `Company status can be only Active: ${OrganizationStatus.ACTIVE}, In-Active: ${OrganizationStatus.IN_ACTIVE}, Blocked: ${OrganizationStatus.BLOCKED}`
        },
        default: OrganizationStatus.ACTIVE
    },
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
    website: {
        type: String
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

organizationSchema.index({ code: 1 }, { unique: true });
organizationSchema.index({ status: 1 })


export const Organization = model<IOrganization>("Organization", organizationSchema);