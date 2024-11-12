import { Types } from "mongoose";
import { UserSession, IUserSession } from "../models/UserSession";

export interface userSessionTokens {
    accessToken: string,
    refreshToken: string
}

export const getByUser = (user: string | Types.ObjectId, isActive: boolean = false) => {
    return UserSession.find({ user: user, isActive: isActive });
}

export const create = (session: IUserSession) => {
    const newSession = new UserSession(session);
    return newSession.save();
}

export const generateHositedSession = (user: string | Types.ObjectId) => {
    return new UserSession({
        user: user
    })
}

export const updateTokensById = (id: string | Types.ObjectId, tokens: userSessionTokens) => {
    return UserSession.updateOne({ _id: id }, { $set: { tokens: tokens } });
}