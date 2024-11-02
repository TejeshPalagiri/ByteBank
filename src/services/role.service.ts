import { Types, } from "mongoose";
import { IRole, Role } from "../models/Role";
import * as _ from "lodash";

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

export const findById = (_id: string | Types.ObjectId, relations: boolean = false) => {
    if (relations) {
        return Role.findById(_id).populate({ path: 'capability', select: ['name', 'previlege'] })
    }
    return Role.findById(_id);
}

export const getAllByOrganization = (organization: string | Types.ObjectId, isDeleted: boolean = false, isDefault: boolean | Array<boolean> = [true, false]) => {
    if(!Array.isArray(isDefault)) {
        isDefault = [isDefault]
    }
    return Role.find({ organization: organization, isDeleted: isDeleted, isDefault: { $in : isDefault } });
}

export const update = (_id: string | Types.ObjectId, updatedDoc: IRole) => {
    return Role.findOneAndUpdate({ _id: _id }, { $set: { ...updatedDoc } }, { upsert: true, new: true })
}