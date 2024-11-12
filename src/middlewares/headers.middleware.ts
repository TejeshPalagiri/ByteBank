import { NextFunction, Request, Response } from "express";
import _ from "lodash"; 
import WobbleAuthError from "../utils/WobbleAuthError";

export const checkHeaders = (checkKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const header = req.headers[checkKey] || req.cookies[checkKey];
            if(_.isEmpty(header)) {
                throw new WobbleAuthError(400, `Invalid request, missing required params`);
            }
            req.organization = header;
            req.body.organization = header;
            next();
        } catch (error) {
            return next(error);
        }
    }
}