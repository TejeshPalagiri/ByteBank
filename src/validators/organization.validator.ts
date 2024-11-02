import { z } from 'zod';
import * as constants from "../utils/constants";
import { NextFunction, Request, Response } from 'express';
import WobbleAuthError from '../utils/WobbleAuthError';


export const createOrganization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            name: z.string().min(constants.ORGANIZATION_NAME_MIN_LENGTH).max(constants.ORGANIZATION_NAME_MAX_LENGTH),
            code: z.string().min(constants.ORGANIZATION_CODE_MIN_LENGTH).max(constants.ORGANIZATION_CODE_MAX_LENGTH),
            website: z.string().regex(constants.COMMON.URL),
            email: z.string().regex(constants.COMMON.EMAIL_REGEX)
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

