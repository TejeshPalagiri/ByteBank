import { Types } from "mongoose";
import { IFolder, Folder } from "../models/Folder";

export const getAll = (parent: string | undefined | Types.ObjectId, space: string | Types.ObjectId, owner: string | Types.ObjectId, isDeleted: boolean = false) => {
    return Folder.find({ parent: parent, space: space, owner: owner, isDeleted: isDeleted });
}

export const getById = (_id: string | Types.ObjectId, owner: string | Types.ObjectId, isDeleted: boolean = false) => {
    return Folder.findOne({ _id: _id, owner: owner, isDeleted: isDeleted });
}

export const create = async (folder: IFolder | Array<IFolder>) => {
    if (!Array.isArray(folder)) {
        folder = [folder];
    }

    const promises: Array<Promise<IFolder>> = [];
    for (let s of folder) {
        let dbRecord = new Folder(s);
        promises.push(dbRecord.save());
    }
    return Promise.all(promises);
}

export const update = async (_id: string | Types.ObjectId, updatedFolder: IFolder) => {
    return Folder.findOneAndUpdate({ _id: _id }, { $set: { ...updatedFolder } }, { new: true, upsert: true });
}

export const deleteFolder = (_id: string | Types.ObjectId, user: string | Types.ObjectId) => {
    return Folder.findOneAndUpdate({ _id: _id }, { $set: { isDeleted: true, updatedBy: user } }, { new: true })
}