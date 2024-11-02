import { NextFunction, Request, Response } from "express";
import * as CapabilityService from "../services/capability.service";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await CapabilityService.create(req.body);

        res.status(200).json({
            success: true,
            message: "Created Capability successfully."
        })
    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params: any = req.query;
        const capabilities = await CapabilityService.getAll(params.isDeleted);

        res.status(200).json({
            success: true,
            data: capabilities
        })
    } catch (error) {
        next(error);
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const capability = await CapabilityService.getById(id);

        res.status(200).json({
            success: true,
            data: capability
        })
    } catch (error) {
        next(error);
    }
}

export const updatedCapability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const capability = await CapabilityService.update(id, req.body);

        res.status(200).json({
            success: true,
            message: "Updated capability successfully."
        })
    } catch (error) {
        next(error);
    }
}