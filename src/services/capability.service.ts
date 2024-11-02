import { Types } from "mongoose";
import { ICapability, Capability } from "../models/Capability";

export const getAll = (isDeleted: boolean = false) => {
    return Capability.find({ isDeleted: isDeleted })
}

export const getById = (id: string | Types.ObjectId) => {
    return Capability.findById(id);
}

export const create = (capability: ICapability | Array<ICapability>) => {
    if (!Array.isArray(capability)) {
        capability = [capability];
    }

    const promises: Array<Promise<ICapability>> = [];
    for (let c of capability) {
        let dbRecord = new Capability(c);
        promises.push(dbRecord.save());
    }
    return Promise.all(promises);
}

export const update = (_id: string | Types.ObjectId, updatedDoc: ICapability) => {
    return Capability.findOneAndUpdate({ _id: _id }, { $set: { ...updatedDoc } }, { upsert: true, new: true })
}