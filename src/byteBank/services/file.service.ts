import { Types } from "mongoose";
import { IFile, File } from "../models/File";
import { MAX_ENTITIES_PER_PAGE } from "../../config";

export const getAll = async (
    parent: string | undefined | Types.ObjectId,
    space: string | Types.ObjectId,
    owner: string | Types.ObjectId,
    page: number = 1,
    isDeleted: boolean = false
) => {
    const files = await File.find({
        parent: parent,
        space: space,
        owner: owner,
        isDeleted: isDeleted,
    })
        .skip((page - 1) * MAX_ENTITIES_PER_PAGE)
        .limit(MAX_ENTITIES_PER_PAGE);
    const promises = files.map(async (file) => {
        const signedUrl = await file.signedURL();
        return {
            ...file.toObject(),
            signedUrl,
        };
    });
    const filesWithSignedUrls = await Promise.all(promises);
    return filesWithSignedUrls;
};

export const getById = async (
    _id: string | Types.ObjectId,
    owner: string | Types.ObjectId,
    isDeleted: boolean = false
) => {
    const file = await File.findOne({ _id: _id, owner: owner, isDeleted: isDeleted });
    if (!file) {
        throw new Error("File not found");
    }
    const signedUrl = await file.signedURL();
    return {
        ...file.toObject(),
        signedUrl,
    };
};

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
};

export const update = async (
    _id: string | Types.ObjectId,
    updatedFolder: IFile
) => {
    return File.findOneAndUpdate(
        { _id: _id },
        { $set: { ...updatedFolder } },
        { new: true, upsert: true }
    );
};

export const deleteFile = async (
    _id: string | Types.ObjectId,
    user: string | Types.ObjectId,
    softDelete = true
) => {
    if (!softDelete) {
        return File.findOneAndDelete({ _id: _id });
    }
    return File.findOneAndUpdate(
        { _id: _id },
        { $set: { isDeleted: true, updatedBy: user } },
        { new: true }
    );
};


export const getFileByName = async (name: string, owner : string | Types.ObjectId) => {
    return File.findOne({ name, owner });
}