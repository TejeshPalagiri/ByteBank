import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/user.service";
import * as UserSessionService from "../services/userSession.service";
import * as RoleService from "../services/role.service";
import WobbleAuthError from "../utils/WobbleAuthError";
import _ from "lodash";
import moment from "moment";

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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = await UserService.findUserByEmailOrUsername(req.body?.email);

        if(_.isEmpty(user)) {
            return res.status(200).json({
                success: true,
                message: "Password reset link should be sent to the user.",
            })
        }

        const token = user.generateForgotPasswordToken();
        await user.save();

        // TODO: Send an email to the user

        res.status(200).json({
            success: true,
            message: "Password reset link should be sent to the user.",
            data: {
                resetToken: token
            }
        })
    } catch (error) {
        next(error);
    }
}


export const verifyPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const dbUser = await UserService.findUserByForgotCode(token);

        if(_.isEmpty(dbUser)) {
            throw new WobbleAuthError(400, "Reset password link has been expired.")
        }

        if(moment(new Date()).isAfter(moment(dbUser.forgotPasswordTokenExpiry))) {
            throw new WobbleAuthError(400, "Reset password link has been expired.")
        }

        // So now the user passed token is legit

        res.status(200).json({
            success: true,
            message: "User is legit and continue password update."
        })

    } catch (error) {
        next(error);
    }
}

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const dbUser = await UserService.findUserByForgotCode(token);
        const { password } = req.body;

        if(_.isEmpty(dbUser)) {
            throw new WobbleAuthError(400, "Reset password link has been expired.")
        }

        if(moment(new Date()).isAfter(moment(dbUser.forgotPasswordTokenExpiry))) {
            throw new WobbleAuthError(400, "Reset password link has been expired.")
        }

        // So now the user passed token is legit
        dbUser.password = password;
        dbUser.forgotPasswordToken = undefined;
        dbUser.forgotPasswordTokenExpiry = undefined;

        await dbUser.save();

        res.status(200).json({
            success: true,
            message: "Updated password successfully."
        })

    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req?.currentUser?.id;
        const { password, currentPassword } = req.body;

        const dbUser = await UserService.findUserById(user, false, true);

        if(!dbUser.comparePassword(currentPassword)) {
            throw new WobbleAuthError(400, "Provided current password is invalid.");
        }

        if(password === currentPassword) {
            throw new WobbleAuthError(400, "Old and New password can't be same.");
        }
        
        dbUser.password = password;
        await dbUser.save();

        res.status(200).json({
            success: true,
            message: "Changed password successfully."
        })
    } catch (error) {
        next(error);
    }
}

export const me =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.currentUser.id;

        const dbUser = await UserService.findUserById(user, true);

        res.status(200).json({
            success: true,
            data: dbUser
        })
        
    } catch (error) {
        next(error);
    }
}