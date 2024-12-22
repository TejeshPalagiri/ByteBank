import { model, Schema, Types } from "mongoose";
import { IBase } from "../../models/Base";


export const SUPPORTED_MIME_TYPES: string[] = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/heif",
    "image/heic",
    "image/apng",

    // PDF
    "application/pdf",

    // Videos
    "video/mp4",
    "video/webm",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/3gpp",
    "video/3gpp2",
    "video/ogg",
];


export interface IFile extends IBase {
    name: string,
    description: string,
    space: Types.ObjectId,
    owner: Types.ObjectId,
    parent: Types.ObjectId,
    mimeType: string,
    size: number,
    thumbnail: string,
    passcode: string
}

const fileSchema = new Schema<IFile>({
    name: {
        type: String,
        required: [true, "Please provide name of the file."]
    },
    description: {
        type: String
    },
    space: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide space to which the file needs to be saved."]
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide owner of the file."]
    },
    parent: {
        type: Schema.Types.ObjectId
    },
    mimeType: {
        type: String,
        enum: {
            values: SUPPORTED_MIME_TYPES,
            message: "Invalid file type."
        }
    },
    size: {
        type: Number,
        required: [true, "Please provide size of the file."]
    },
    thumbnail: {
        type: String
    },
    passcode: {
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

fileSchema.index({ name: 1, parent: 1, space: 1 }, { unique: true });

export const File = model<IFile>("File", fileSchema);