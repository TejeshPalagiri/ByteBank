import { Types } from "mongoose";
import { Organization, OrganizationStatus, IOrganization } from "../models/Organization";
import * as _ from "lodash";

export const findOrganizationByCode = (code: string, status: OrganizationStatus = OrganizationStatus.ACTIVE) => {
    return Organization.findOne({ code: code, status: status })
}

export const findOrganizationById = (id: string | Types.ObjectId) => {
    return Organization.findById(id);
}

export const findOrganizationByStatus = (status: OrganizationStatus | Array<OrganizationStatus> = OrganizationStatus.ACTIVE) => {
    if (!Array.isArray(status)) {
        status = [status];
    }

    return Organization.find({
        status: { $in: status }
    })
}

export const createOrganization = async (org: IOrganization) => {
    if(org._id) {
        let dbOrg = await Organization.findById(org._id);
        dbOrg = _.assign(dbOrg, org);
        return dbOrg.save();
    }
    const newOrganization = new Organization(org);
    return newOrganization.save();
}

export const updateOrganizationStatus = (org: string | Types.ObjectId, status: OrganizationStatus) => {
    return Organization.updateOne({ _id: org }, { $set: { status: status } });
}