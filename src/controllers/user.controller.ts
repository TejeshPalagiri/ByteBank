import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/user.service";
import * as UserSessionService from "../services/userSession.service";
import * as RoleService from "../services/role.service";

export const login = (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        next(error);
    }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organization } = req.body;
        const defaultRole = await RoleService.getAllByOrganization(organization, false, true);
        req.body.role = defaultRole[0]._id;
        
        await UserService.createUser(req.body);

        res.status(200).json({
            success: true,
            message: "User signedup successfully."
        })
    } catch (error) {
        next(error)
    }
}