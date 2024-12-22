import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from "../utils/constants";
import WobbleAuthError from "../../utils/WobbleAuthError";

export const createFolder = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            name: z.string()
                .min(TITLE_MIN_LENGTH, { message: `Minium length of name of space should be ${TITLE_MIN_LENGTH}` })
                .max(TITLE_MAX_LENGTH, { message: `Maximum length of name of space should be ${TITLE_MAX_LENGTH}` })
        }).safeParse(req.body);
        if (!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const getAll = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            name: z.string()
                .min(TITLE_MIN_LENGTH, { message: `Minium length of name of space should be ${TITLE_MIN_LENGTH}` })
                .max(TITLE_MAX_LENGTH, { message: `Maximum length of name of space should be ${TITLE_MAX_LENGTH}` })
        }).safeParse(req.body);
        if (!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        next();
    } catch (error) {
        next(error);
    }
}