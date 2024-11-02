import { NextFunction, Response, Request } from "express";
import * as OrganizationService from "../services/organization.service";
import WobbleAuthError from "../utils/WobbleAuthError";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await OrganizationService.createOrganization(req.body);
        res.status(200).json({
            success: true,
            message: `Organization ${req.method === "POST" ? "created" : "updated"}  successfully.`
        })
    } catch (error) {
        if(error?.message?.includes("duplicate key error") && error?.message?.includes("code")) {
            return next(new WobbleAuthError(400, "Organization with the given code already exists"))
        }
        next(error);
    }
}

export const updateOrganizationStatus = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await OrganizationService.updateOrganizationStatus(req.body.organization, req.body.status);
        res.status(200).json({
            success: true,
            message: "Updated organization status successfully."
        })
    } catch (error) {
        next(error);
    }
}

export const get = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const params: any = req.query;
        const organizations = await OrganizationService.findOrganizationByStatus(params?.status);

        res.status(200).json({
            success: true,
            data: organizations
        })
    } catch (error) {
        next(error);
    }
}

export const getOrgByCode = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.params;
        const organization = await OrganizationService.findOrganizationByCode(code);

        res.status(200).json({
            success: true,
            data: organization
        })
    } catch (error) {
        next(error);
    }
}

export const getOrgById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const organization = await OrganizationService.findOrganizationById(id);

        res.status(200).json({
            success: true,
            data: organization
        })
    } catch (error) {
        next(error);
    }
}