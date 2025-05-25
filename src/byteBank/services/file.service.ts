import { Types } from "mongoose";
import { IFile, File } from "../models/File";

export const getAll = (parent: string | undefined | Types.ObjectId, space: string | Types.ObjectId, owner: string | Types.ObjectId, isDeleted: boolean = false) => {
    return File.find({ parent: parent, space: space, owner: owner, isDeleted: isDeleted });
}

export const getById = (_id: string | Types.ObjectId, owner: string | Types.ObjectId, isDeleted: boolean = false) => {
    return File.findOne({ _id: _id, owner: owner, isDeleted: isDeleted });
}

export const create = async (folder: IFile | Array<IFile>) => {
    if (!Array.isArray(folder)) {
        folder = [folder];
    }

    const promises: Array<Promise<IFile>> = [];
    for (let s of folder) {
        let dbRecord = new File(s);
        promises.push(dbRecord.save());
    }
    return Promise.all(promises);
}

export const update = async (_id: string | Types.ObjectId, updatedFolder: IFile) => {
    return File.findOneAndUpdate({ _id: _id }, { $set: { ...updatedFolder } }, { new: true, upsert: true });
}

export const deleteFile = async (_id: string | Types.ObjectId, user: string | Types.ObjectId, softDelete = true) => {
    if(!softDelete) {
        return File.findOneAndDelete({ _id: _id });
    }
    return File.findOneAndUpdate({ _id: _id }, { $set: { isDeleted: true, updatedBy: user } }, { new: true });
}