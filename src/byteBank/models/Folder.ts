import { model, Schema, Types } from "mongoose";
import { IBase } from "../../models/Base";

export interface IFolder extends IBase {
    name: string,
    description: string,
    space: Types.ObjectId,
    parent: Types.ObjectId
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
    isDeleted: {
        type: Boolean,
        default: false
    }
})

folderSchema.index({ name: 1, parent: 1, space: 1 }, { unique: true });

export const Folder = model<IFolder>("Folder", folderSchema);