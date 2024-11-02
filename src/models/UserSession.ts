import { Schema, Types, model } from "mongoose";
import { ITimestamp } from "./TimeStamp";

export interface IUserSession extends ITimestamp {
    user: Types.ObjectId,
    userAgent: string,
    isActive: boolean,
    ipAddress: string,
    tokens: {
        accessToken: string,
        refreshToken: string
    }
}

const userSessionSchema = new Schema<IUserSession>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userAgent: {
        type: String,
        required: [true, "Please provide user agent to create an user session."]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    ipAddress: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    tokens: {
        accessToken: {
            type: String
        },
        refreshToken: {
            type: String
        }
    }
})

export const UserSession = model<IUserSession>("UserSession", userSessionSchema);