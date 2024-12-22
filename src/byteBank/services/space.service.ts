import { Types } from "mongoose";
import { ISpace, Space } from "../models/Space";

export const getAll = (owner: string | Types.ObjectId, isDeleted: boolean = false) => {
    return Space.find({ owner: owner, isDeleted: isDeleted });
}

export const getById = (_id: string | Types.ObjectId, owner: string | Types.ObjectId, isDeleted: boolean = false) => {
    return Space.findOne({ _id: _id, owner: owner, isDeleted: isDeleted });
}

export const create = async (space: ISpace | Array<ISpace>) => {
    if(!Array.isArray(space)) {
        space = [space];
    }

    const promises: Array<Promise<ISpace>> = [];
    for(let s of space)  {
        let dbRecord = new Space(s);
        promises.push(dbRecord.save());
    }
    return Promise.all(promises);
}

export const update = async (_id: string | Types.ObjectId, updatedSpace: ISpace) => {
    return Space.findOneAndUpdate({ _id: _id }, { $set: { ...updatedSpace } }, { new: true, upsert: true });
}