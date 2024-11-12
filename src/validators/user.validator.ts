import { z } from 'zod';
import * as constants from "../utils/constants";
import { NextFunction, Request, Response } from 'express';
import WobbleAuthError from '../utils/WobbleAuthError';

export const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            userName: z.string().min(constants.USERNAME_MIN_LENGTH).max(constants.USERNAME_MAX_LENGTH).regex(constants.USERNAME_REGEX, { message: "Username must be 3-16 characters long and can contain only letters, numbers, underscores, dots, and hyphens." }),
            password: z.string().min(constants.USER_PASSWORD_MIN_LENGTH).max(constants.USER_PASSWORD_MAX_LENGTH).regex(constants.USER_PASSWORD_REGEX, { message: "A password should have alteast 1 uppercase, 1 lowercase, 1 number and 1 special charecter." }),
            organization: z.string()
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

export const signup = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            firstName: z.string().min(constants.USERNAME_MIN_LENGTH).max(constants.USERNAME_MAX_LENGTH),
            lastName: z.string().min(constants.USERNAME_MIN_LENGTH).max(constants.USERNAME_MAX_LENGTH),
            email: z.string().min(constants.USER_EMAIL_MIN_LENGTH).max(constants.USER_EMAIL_MAX_LENGTH).regex(constants.COMMON.EMAIL_REGEX, "Please provide a valid mail address."),
            userName: z.string().min(constants.USERNAME_MIN_LENGTH).max(constants.USERNAME_MAX_LENGTH).regex(constants.USERNAME_REGEX, { message: "Username must be 3-16 characters long and can contain only letters, numbers, underscores, dots, and hyphens." }),
            organization: z.string(),
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            password: z.string().min(constants.USER_PASSWORD_MIN_LENGTH).max(constants.USER_PASSWORD_MAX_LENGTH).regex(constants.USER_PASSWORD_REGEX, { message: "A password should have alteast 1 uppercase, 1 lowercase, 1 number and 1 special charecter." })
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            email: z.string().regex(constants.COMMON.EMAIL_REGEX, "Please provide a valid mail address."),
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

export const updatePassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            password: z.string().min(constants.USER_PASSWORD_MIN_LENGTH).max(constants.USER_PASSWORD_MAX_LENGTH).regex(constants.USER_PASSWORD_REGEX, { message: "A password should have alteast 1 uppercase, 1 lowercase, 1 number and 1 special charecter." })
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

export const changePassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            password: z.string().min(constants.USER_PASSWORD_MIN_LENGTH).max(constants.USER_PASSWORD_MAX_LENGTH).regex(constants.USER_PASSWORD_REGEX, { message: "A password should have alteast 1 uppercase, 1 lowercase, 1 number and 1 special charecter." }),
            currentPassword: z.string().min(constants.USER_PASSWORD_MIN_LENGTH).max(constants.USER_PASSWORD_MAX_LENGTH).regex(constants.USER_PASSWORD_REGEX, { message: "A password should have alteast 1 uppercase, 1 lowercase, 1 number and 1 special charecter." }),
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}