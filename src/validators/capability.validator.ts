import { z } from 'zod';
import * as constants from "../utils/constants";
import { NextFunction, Request, Response } from 'express';
import WobbleAuthError from '../utils/WobbleAuthError';


export const createCapability = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            name: z.string(),
            description: z.string(),
            previlege: z.object({
                key: z.string(),
                read: z.boolean(),
                write: z.boolean(),
                edit: z.boolean(),
                delete: z.boolean()
            })
        }).safeParse(req.body);

        if (!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }

        next();
    } catch (error) {
        next(error);
    }
}