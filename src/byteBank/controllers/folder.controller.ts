import { NextFunction, Request, Response } from "express";
import * as FolderService from "../services/folder.service";
import WobbleAuthError from "../../utils/WobbleAuthError";
import * as _ from "lodash";

export const createFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        req.body.updatedBy = owner;
        req.body.createdBy = owner;
        req.body.owner = owner;
        if(_.isEmpty(req.body.path)) {
            req.body.path = `${req.space}/${req.body.name}/`;
        }
        await FolderService.create(req.body);

        res.status(200).json({
            success: true,
            message: "Created Folder successfully."
        })
    } catch (error) {
        if(error.code === 11000) {
            let wobbleAuthError = new WobbleAuthError(400, "Folder with the given name already exists.");
            return next(wobbleAuthError);
        }
        next(error);
        console.error(error);
    }
}

export const updateFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        req.body.updatedBy = owner;
        const dbFolderRecord =  await FolderService.getById(req.params.id, owner);

        if(_.isEmpty(dbFolderRecord)) {
            // TODO: For now throwing error | The update function can help creating if doesn't exists.
            throw new WobbleAuthError(400, "No Folder found to updated the space.");
        }
        let updatedDoc = _.assign(dbFolderRecord, req.body);

        await FolderService.update(req.params.id, updatedDoc);

        res.status(200).json({
            success: true,
            message: "Updated folder successfully."
        })
    } catch (error) {
        if(error.code === 11000) {
            let wobbleAuthError = new WobbleAuthError(400, "Folder with the given name already exists.");
            return next(wobbleAuthError);
        }
        next(error);
        console.error(error);
    }
}

export const getFolderById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        const folder = await FolderService.getById(req.params.id, owner);

        res.status(200).json({
            success: true,
            data: folder
        })
    } catch (error) {
        next(error);
        console.error(error);
    }
}

export const getFolders = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { parent } = req.body;
        const owner = req.currentUser.id;
        const space = req.space;
        const folders = await FolderService.getAll(parent, space, owner);

        res.status(200).json({
            success: true,
            data: folders
        })
    } catch (error) {
        next(error);
        console.error(error);
    }
}

export const deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = req.currentUser.id;
        await FolderService.deleteFolder(id, user);

        res.status(200).json({
            success: true,
            message: "Deleted Folder successfully."
        })
    } catch (error) {
        next(error);
        console.error(error);
    }
}