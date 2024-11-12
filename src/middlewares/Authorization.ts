import { NextFunction, Request, Response } from "express";
import * as _ from "lodash";
import * as token from "../utils/token";
import { User } from "../models/User";
import * as config from "../config";
import * as UserSessionService from  "../services/userSession.service";

export const requiresLogin: any = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken = req.headers["x-header-accesstoken"] || req.cookies.token;
        let refreshToken =  req.headers["x-header-refreshtoken"] || req.cookies.refreshToken;

        if (_.isEmpty(accessToken)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Please login again.",
            });
        }

        try {
            const tokenData = await token.verifyAccessToken(accessToken);
            req.currentUser = tokenData;
            return next();
        } catch (error) {
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Session Expired. Please login again",
                });
            }

            const refreshTokenData = await token.verifyRefreshToken(
                refreshToken
            );

            if (error.name === "TokenExpiredError") {
                // Remove current access token in redis
                const user = await User.findById(refreshTokenData);
                const newTokens = user.generateSessionTokens();

                // Updating the newly added tokens 
                await UserSessionService.updateTokensById(refreshTokenData.session, newTokens)

                // Setting new access and refresh tokens into the response headers
                res.set({
                    "x-header-accesstoken": newTokens.accessToken,
                    "x-header-refreshtoken": newTokens.refreshToken,
                });
                return next();
            }
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session Expired. Please login again.",
        });
    }
};

export const requiresSuperUserToken: any = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const superUserToken = req.headers["x-header-superusertoken"];

        if (!superUserToken) {
            return res.status(401).json({
                success: false,
                message: "Un-Authorized access.",
            });
        }

        if (superUserToken !== config.SUPER_USER_TOKEN) {
            return res.status(401).json({
                success: false,
                message: "Un-Authorized access.",
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Un-Authorized access.",
        });
    }
};