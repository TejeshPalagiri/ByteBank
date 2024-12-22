import { Types, Schema, model } from "mongoose";
import { IBase } from "../../models/Base";

export interface ISpace extends IBase {
    name: string,
    owner: Types.ObjectId,
    description: string,
    size: number
}

const spaceSchema = new Schema<ISpace>({
    name: {
        type: String,
        required: [true, "Please provide Space name."]
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: [true, "Please provide the owner of the space."]
    },
    description: {
        type: String
    },
    size: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

spaceSchema.index({ name: 1, owner: 1 }, { unique: true })

export const Space = model<ISpace>("Space", spaceSchema)