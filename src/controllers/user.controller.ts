import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/user.service";
import * as UserSessionService from "../services/userSession.service";
import * as RoleService from "../services/role.service";
import WobbleAuthError from "../utils/WobbleAuthError";
import _ from "lodash";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dbUser = await UserService.findUserByEmailOrUsername(req.body.userName, true);
        if(!dbUser.comparePassword(req.body.password)) {
            throw new WobbleAuthError(400, "Invalid credentials provided.");
        }
        const userSession = UserSessionService.generateHositedSession(dbUser._id);

        const sessionTokens = dbUser.generateSessionTokens(userSession._id);

        userSession.tokens = sessionTokens;
        userSession.ipAddress = req.ipAddress;
        userSession.userAgent = req.userAgent;

        await userSession.save();

        res.set({
            "x-header-accesstoken": sessionTokens.accessToken,
            "x-header-refreshtoken": sessionTokens.refreshToken
        });

        res.status(200).json({
            success: true,
            message: "User loggedin successfully."
        })

    } catch (error) {
        next(error);
    }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organization } = req.body;
        const defaultRole = await RoleService.getAllByOrganization(organization, false, true);
        req.body.role = defaultRole[0]._id;
        
        await UserService.createUser(req.body);

        res.status(200).json({
            success: true,
            message: "User signedup successfully."
        })
    } catch (error) {
        next(error)
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { verificationcode } = req.params;

        const dbUser = await UserService.findUserByVerificationCode(verificationcode);

        if(_.isEmpty(dbUser)) {
            throw new WobbleAuthError(400, "Invalid verification code, Rejected!");
        }
        
        const { password } = req.body;
        dbUser.password = password;
        await dbUser.save();

        res.status(200).json({
            success: true,
            message: "User verified successfully."
        })
    } catch (error) {
        next(error);
    }
}