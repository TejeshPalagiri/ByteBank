import { NextFunction, Request, Response } from "express";
import * as SpaceService from "../services/space.service";
import WobbleAuthError from "../../utils/WobbleAuthError";
import * as _ from "lodash";

export const createSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        req.body.updatedBy = owner;
        req.body.createdBy = owner;
        req.body.owner = owner;
        await SpaceService.create(req.body);

        res.status(200).json({
            success: true,
            message: "Created Space successfully."
        })
    } catch (error) {
        if(error.code === 11000) {
            let wobbleAuthError = new WobbleAuthError(400, "Space with the given name already exists.");
            return next(wobbleAuthError);
        }
        next(error);
        console.error(error);
    }
}

export const updateSpace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        req.body.updatedBy = owner;
        const dbSpaceRecord =  await SpaceService.getById(req.params.id, owner);

        if(_.isEmpty(dbSpaceRecord)) {
            // TODO: For now throwing error | The update function can help creating if doesn't exists.
            throw new WobbleAuthError(400, "No Space found to updated the space.");
        }
        let updatedDoc = _.assign(dbSpaceRecord, req.body);

        await SpaceService.update(req.params.id, updatedDoc);

        res.status(200).json({
            success: true,
            message: "Updated space successfully."
        })
    } catch (error) {
        if(error.code === 11000) {
            let wobbleAuthError = new WobbleAuthError(400, "Space with the given name already exists.");
            return next(wobbleAuthError);
        }
        next(error);
        console.error(error);
    }
}

export const getSpaceById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        const space = await SpaceService.getById(req.params.id, owner);

        res.status(200).json({
            success: true,
            data: space
        })
    } catch (error) {
        next(error);
        console.error(error);
    }
}

export const getSpaces = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const owner = req.currentUser.id;
        const spaces = await SpaceService.getAll(owner)

        res.status(200).json({
            success: true,
            data: spaces
        })
    } catch (error) {
        next(error);
        console.error(error);
    }
}