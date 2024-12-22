import { model, Schema, Types } from "mongoose";
import { IBase } from "../../models/Base";
import * as S3 from "../utils/s3.utils";

export interface IFolder extends IBase {
    name: string,
    description: string,
    space: Types.ObjectId,
    parent: Types.ObjectId,
    owner: Types.ObjectId,
    path: string
}

const folderSchema = new Schema<IFolder>({
    name: {
        type: String,
        required: [true, "Please provide name of the folder."]
    },
    description: {
        type: String
    },
    space: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide the space where the folder needs to be saved."]
    },
    parent: {
        type: Schema.Types.ObjectId
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide the owner of the folder."]
    },
    path: {
        type: String
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
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide the owner of the folder."]
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide the owner of the folder."]
    }
})

folderSchema.index({ name: 1, parent: 1, space: 1 }, { unique: true });
folderSchema.pre("save", async function(next) {
    if(this.isNew) {
        const res = await S3.createFolderInBucket(this.path);
        console.log(res);
    }
    next();
})

export const Folder = model<IFolder>("Folder", folderSchema);