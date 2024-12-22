import { NextFunction, Request, Response } from "express";
import _, { head } from "lodash"; 
import WobbleAuthError from "../utils/WobbleAuthError";

export const checkHeaders = (checkKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const header = req.headers[checkKey] || req.cookies[checkKey];
            if(_.isEmpty(header)) {
                throw new WobbleAuthError(400, `Invalid request, missing required params`);
            }
            detachHeaders(req, checkKey);
            next();
        } catch (error) {
            return next(error);
        }
    }
}

const detachHeaders = (req: Request, key: string) => {
    const header = req.headers[key] || req.cookies[key]
    switch(key) {
        case "x-header-organization":
            req.organization = header;
            req.body.organization = header;
            break;
        case "x-header-space":
            req.space = header;
            req.body.space = header;
            break;
        default:
            console.error("Unsupported Header recieved", header, key);
            break;
    }
}