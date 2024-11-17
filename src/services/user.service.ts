import { Types } from "mongoose";
import { IUser, User, UserStatus } from "../models/User";
import * as _ from "lodash";

export const findUserByEmailOrUsername = (username: string, selectPassword: boolean = false, status: UserStatus = UserStatus.ACTIVE, isVerified: boolean = true) => {
    const user = User.findOne({
        status: status,
        $or: [
            { userName: username.toLowerCase() },
            { email: username.toLowerCase() }
        ],
        isVerified: isVerified
    })

    if (selectPassword) {
        return user.select("+password").select("+salt");
    }
    return user;
}

export const createUser = async (user: IUser | Array<IUser>) => {
    if (!Array.isArray(user)) {
        user = [user];
    }
    const promises: Array<Promise<IUser>> = [];
    for (let u of user) {
        let dbUser = await findUserByEmailOrUsername(u.email || u.userName);
        if (_.isEmpty(dbUser)) {
            dbUser = new User(u);
        }
        promises.push(dbUser.save());
    }

    return Promise.all(promises);
}

export const findUserById = (id: string | Types.ObjectId, capabilities: boolean = false, selectPassword: boolean = false) => {
    if(selectPassword) {
        return User.findById(id).select("+password").select("+salt");
    }
    if(capabilities) {
        return User.findById(id).populate({ path: 'role' }).populate({ path: 'extraCapabilities' });
    }
    return User.findById(id);
}

export const findUserByOrganization = (organization: string | Types.ObjectId, status: UserStatus | Array<UserStatus> = [UserStatus.ACTIVE], isDeleted: boolean = false) => {
    if(!Array.isArray(status)) {
        status = [status]
    }
    return User.find({ organization: organization, status: { $in: status }, isDeleted: isDeleted,  })
}

export const findUserByVerificationCode = (verificationCode: string) => {
    return User.findOne({ verificationcode: verificationCode });
}

export const findUserByForgotCode = (forgotToken: string) => {
    return User.findOne({ forgotPasswordToken: forgotToken });
}