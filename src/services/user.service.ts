import { Types } from "mongoose";
import { IUser, User, UserStatus } from "../models/User";
import * as _ from "lodash";

export const findUserByEmailOrUsername = (username: string, status: UserStatus = UserStatus.ACTIVE, selectPassword: boolean = false, isVerified: boolean = true) => {
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

export const findUserById = (id: string | Types.ObjectId) => {
    return User.findById(id);
}