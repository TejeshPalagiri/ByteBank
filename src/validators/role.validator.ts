import { z } from 'zod';
import * as constants from "../utils/constants";
import { NextFunction, Request, Response } from 'express';
import WobbleAuthError from '../utils/WobbleAuthError';

export const createRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            title: z.string(),
            label: z.string(),
            organization: z.string(),
            capability: z.array(z.string())
        }).safeParse(req.body);

        if(!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }

        next();
    } catch (error) {
        next(error);
    }
}