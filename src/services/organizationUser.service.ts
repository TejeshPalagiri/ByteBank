import { Types } from "mongoose";
import { IOrganizationUser, OrganizationUserStatus, OrganizationUser } from "../models/OrganizationUser";
import * as _ from "lodash";

export const findByOrganizationAndUser = (userId: string | Types.ObjectId, organization: string | Types.ObjectId, status: OrganizationUserStatus = OrganizationUserStatus.ACTIVE) => {
    return OrganizationUser.findOne({ user: userId, organization: organization }).populate({ path: "role", select: ["capabilty", "title", "lable"] }).populate({ path: "extraCapabilities", select: ["previlege", "name"] });
}

export const createOrganizationUser = async (organizationUser: IOrganizationUser | Array<IOrganizationUser>) => {
    if(!Array.isArray(organizationUser)) {
        organizationUser = [organizationUser]
    }

    const promises: Array<Promise<IOrganizationUser>> = [];
    for(let o of organizationUser) {
        let dbRecord = await findByOrganizationAndUser(o.user, o.organization);
        if(_.isEmpty(dbRecord)) {
            dbRecord = new OrganizationUser(o);
        }
        promises.push(dbRecord.save());
    }

    return Promise.all(promises);
}