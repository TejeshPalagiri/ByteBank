import { Types, } from "mongoose";
import { IRole, Role } from "../models/Role";

export const createRole = (role: IRole | Array<IRole>) => {
    if (!Array.isArray(role)) {
        role = [role];
    }
    let promises: Array<Promise<IRole>> = [];

    for (let r of role) {
        let dbRecord = new Role(r);
        promises.push(dbRecord.save());
    }

    return Promise.all(promises);
}

export const findById = (_id: string | Types.ObjectId, relations: true) => {
    if (relations) {
        return Role.findById(_id).populate({ path: 'capability', select: ['name', 'previlege'] })
    }
    return Role.findById(_id);
}

export const getAllByOrganization = (organization: string | Types.ObjectId, isDeleted: boolean = false) => {
    return Role.find({ organization: organization, isDeleted: isDeleted });
}

export const update = (_id: string | Types.ObjectId, updatedDoc: IRole) => {
    return Role.findOneAndUpdate({ _id: _id }, { $set: { ...updatedDoc } }, { upsert: true, new: true })
}