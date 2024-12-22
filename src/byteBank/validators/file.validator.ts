import { NextFunction, Request, Response } from "express";
import WobbleAuthError from "../../utils/WobbleAuthError";
import { z } from "zod";

const SUPPORTED_MIME_TYPES = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/heif",
    "image/heic",
    "image/apng",

    // PDF
    "application/pdf",

    // Videos
    "video/mp4",
    "video/webm",
    "video/x-msvideo",
    "video/quicktime",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/3gpp",
    "video/3gpp2",
    "video/ogg",
] as const;

export const createFile = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            name: z.string(),
            mimeType: z.enum(SUPPORTED_MIME_TYPES, { message: "Unsupported File type." }),
            size: z.number()
        }).safeParse(req.body);
        if (!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export const getUploadUrl = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = z.object({
            key: z.string(),
            mimeType: z.enum(SUPPORTED_MIME_TYPES, { message: "Unsupported File type." })
        }).safeParse(req.body);
        if (!result.success) {
            throw new WobbleAuthError(400, "Invalid required parameters", result.error?.errors);
        }
        next();
    } catch (error) {
        next(error);
    }
}