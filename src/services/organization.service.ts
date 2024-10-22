import { Types } from "mongoose";
import { Organization, OrganizationStatus, IOrganization } from "../models/Organization";

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