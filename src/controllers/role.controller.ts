import { Request, Response, NextFunction } from "express";
import * as RoleService from "../services/role.service";
import WobbleAuthError from "../utils/WobbleAuthError";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req?.body?.isDefault) {
            const defaultRoles = await RoleService.getAllByOrganization(req.body.organization, false, true);
            if(defaultRoles?.length) {
                throw new WobbleAuthError(400, "Default role alredy exists for the given organization.", defaultRoles);
            }
        }

        await RoleService.createRole(req.body);

        res.status(200).json({
            success: true,
            message: "Created role successfully."
        })
    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organization } = req.params;
        const params: any = req.query;
        const roles = await RoleService.getAllByOrganization(organization, false, params?.isDefault);

        res.status(200).json({
            success: true,
            data: roles
        })
    } catch (error) {
        next(error);
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const query: any = req.query
        const role = await RoleService.findById(id, query?.relations);

        res.status(200).json({
            success: true,
            data: role
        })
    } catch (error) {
        next(error);
    }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await RoleService.update(id, req.body);

        res.status(200).json({
            success: true,
            message: "Updated role successfully."
        })
    } catch (error) {
        next(error);
    }
}