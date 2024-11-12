import { Schema, Types, model } from "mongoose";
import { IBase } from "./Base";
import * as cryptoService from "../utils/crypto";
import * as token from "../utils/token";
import crypto from "crypto";
import * as config from "../config";

export enum UserStatus {
    IN_ACTIVE = 0,
    ACTIVE = 1,
    BLOCKED = 2
}

export interface IUser extends IBase {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    phone: string,
    countryCode: string,
    avtar: Types.ObjectId | string,
    fullName?: string,
    status: UserStatus,
    dateOfBirth: Date,
    isVerified: boolean,
    password: string,
    salt: string,
    organization: Types.ObjectId,
    role: Types.ObjectId,
    extraCapabilities: Array<Types.ObjectId>,
    verificationcode: string
    verify: Function,
    generateSessionTokens: Function,
    encryptPassword: Function,
    comparePassword: Function,
    forgotPasswordToken: string,
    forgotPasswordTokenExpiry: Date,
    generateForgotPasswordToken: Function
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: [true, "Please provide first name of the user."]
    },
    lastName: {
        type: String,
        required: [true, "Please provide last name of the user."]
    },
    userName: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Please provide email of the user"]
    },
    phone: {
        type: String
    },
    countryCode: {
        type: String,
        default: "+91"
    },
    avtar: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    status: {
        type: Number,
        enum: {
            values: [UserStatus.IN_ACTIVE, UserStatus.ACTIVE, UserStatus.BLOCKED],
            message: "Please use user Status only from INVITE, ACTIVE, INACTIVE"
        },
        default: UserStatus.ACTIVE
    },
    dateOfBirth: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
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
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    password: {
        type: String,
        select: false
    },
    salt: {
        type: String,
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Please provide the organization."]
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: [true, "Please provide role to create an user."]
    },
    extraCapabilities: [
        {
            type: Schema.Types.ObjectId,
            ref: "Capability"
        }
    ],
    verificationcode: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})


// Adding a virtual field called
userSchema.virtual('fullName')
    .get(function (this: IUser) {
        return `${this.firstName} ${this.lastName}`
    })
    .set(function (this: IUser, fullName: string) {
        const [firstName, lastName] = fullName.split(" ");
        this.firstName = firstName;
        this.lastName = lastName;
    })

userSchema.pre("save", async function (next) {
    if(this.isNew) {
        this.verificationcode = cryptoService.generateRandomId(8);
        // TODO: May be send an email notification to verify the user.
    }
    if (this.isModified("createdAt")) {
        if (!this.userName) {
            this.userName = this.email.split("@")[0];
        }
    }
    if (!this.isModified("password")) {
        return next();
    } else {
        this.salt = crypto.randomBytes(16).toString("base64");
        this.password = this.encryptPassword(this.password);
        this.isVerified = true;
    }
    
    next()
})


// ENCRYPTING PASSWORD 
type encryptPasswordFunction = (password: string) => void;
const encryptPassword: encryptPasswordFunction = function (password) {
    if (!password || !this.salt) {
        return "";
    }
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("base64");
};

userSchema.methods.encryptPassword = encryptPassword;

// Compare password function
userSchema.methods.comparePassword = function (password: string) {
    return this.encryptPassword(password) === this.password;
};


userSchema.methods.generateSessionTokens = function (session: string): { accessToken: string, refreshToken: string } {
    let payload: {
        id: string,
        session?: string
    } = {
        id: cryptoService.encrypt(this._id.toString())
    }

    if(session) {
        payload['session'] = session
    }

    return {
        accessToken: token.createAccessToken(payload),
        refreshToken: token.createRefreshsToken(payload)
    }
}

userSchema.methods.generateForgotPasswordToken = function() {
    this.forgotPasswordToken = cryptoService.generateRandomId(12);
    this.forgotPasswordTokenExpiry = Date.now() + config.RESET_PASSWORD_EXPIRY * 60 * 1000;

    return this.forgotPasswordToken;
}

userSchema.index({ userName: 1, organization: 1 }, { unique: true });
userSchema.index({ email: 1, organization: 1 }, { unique: true });
userSchema.index({ status: 1 });
userSchema.index({ '$**': 'text' });

export const User = model<IUser>("User", userSchema)