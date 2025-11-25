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
}, {
    timestamps: true
})

folderSchema.index({ name: 1, parent: 1, space: 1, isDeleted: 1 }, { unique: true });

folderSchema.post("save", async function(doc) {
    // TODO: Need to check if this overwrites the folder
    const res = await S3.createFolderInBucket(doc.path);
    console.log(res);
})

folderSchema.post("findOneAndUpdate", async (doc) => {
    if(doc.isDeleted) {
        // await S3.createFolderInBucket(doc.path, doc.isDeleted); 
        // TODO: Need to archive the folder instead of deleting it from s3
    }
})

folderSchema.pre("findOneAndDelete", async function (next) {
    const doc = await this.model.findOne(this.getQuery());
    if(doc) {
        await S3.createFolderInBucket(doc.path, true);
    }
    next();
})

export const Folder = model<IFolder>("Folder", folderSchema);