import { Request, Response, NextFunction } from "express";
import * as FileService from "../services/file.service";
import WobbleAuthError from "../../utils/WobbleAuthError";
import * as _ from "lodash";
import * as S3 from "../utils/s3.utils";
import * as FolderService from "../services/folder.service";

export const createFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;

        req.body.createdBy = owner;
        req.body.updatedBy = owner;
        req.body.owner = owner
        if(_.isEmpty(req.body.parent)) {
            req.body.key = `${req.space}/${req.body.name}`;
        } else {
            req.body.key = (await FolderService.getById(req.body.parent, owner)).path + req.body.name
        }
    
        const result = await FileService.create(req.body)
        res.status(200).json({
            success: true,
            message: "File Created successfully.",
            data: result
        })
    } catch (error) {
        if(error.code === 11000) {
            let wobbleAuthError = new WobbleAuthError(400, "File with the given name already exists.");
            return next(wobbleAuthError);
        }
        console.error(error);
        next(error);
    }
}

export const getAllFiles = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let { parent } = req.query;
        const owner = req.currentUser.id;
        const space = req.space;

        let files = await FileService.getAll(parent?.length ? parent?.toString() : undefined, space, owner);

        res.status(200).json({
            success: true,
            data: files
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getFileById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        const { id } = req.params;
        let files = await FileService.getById(id, owner);

        res.status(200).json({
            success: true,
            data: files
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getUploadPresignedUrl = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.key = `${req.body.key}`;
        const url = S3.getUploadPresignedUrl(req.body);

        res.status(200).json({
            success: true,
            data: {
                url: url
            }
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = req.currentUser.id;
        await FileService.deleteFile(id, user);

        res.status(200).json({
            success: true,
            message: "File deleted successfully."
        })

    } catch (error) {
        console.error(error);
        next(error);
    }
}