import { decrypt } from "./crypto";
import * as config from "../config";
import * as jwt from "jsonwebtoken";

interface userPayload {
    userId: string;
}

export const verifyAccessToken = (token: string): Promise<{ id: string, session: string }> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            config.JWT_ACCESS_TOKEN_SECRET,
            (err: Error, userObject: any) => {
                if (err) {
                    return reject(err);
                }
                const user = decrypt(userObject.id);
                return resolve({ id: user, session: userObject?.session });
            }
        );
    });
};

export const createAccessToken = (userObj: any) => {
    return jwt.sign(userObj, config.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: config.JWT_ACCESS_TOKEN_EXPIRY,
    });
};

export const verifyRefreshToken = (token: string): Promise<{ id: string, session: string }> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            config.JWT_REFRESH_TOKEN_SECRET,
            (err: Error, userObject: any) => {
                if (err) {
                    return reject(err);
                }
                const user = decrypt(userObject.userId);
                return resolve({ id: user, session: userObject?.session });
            }
        );
    });
};

export const createRefreshsToken = (userObj: any) => {
    return jwt.sign(userObj, config.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRY,
    });
};