import { NextFunction, Response, Router, Request } from "express";

// Validators
import * as UserValidator from "../validators/user.validator";
import * as OrganizationValidator from "../validators/organization.validator";
import * as CapabilityValidator from "../validators/capability.validator";
import * as RoleValidator from "../validators/role.validator";

// Controllers
import * as UserController from "../controllers/user.controller";
import * as OrganizationController from "../controllers/organization.controller";
import * as CapabilityController from "../controllers/capability.controller";
import * as RoleController from "../controllers/role.controller";

// Middlewares
import * as middlewares from "../middlewares/Authorization";
import { checkHeaders } from "../middlewares/headers.middleware";

const v1 = Router();
/* 
    Routes begin
*/

v1.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Hello from v1."
    });
});


v1.post("/user", checkHeaders('x-header-organization'), UserValidator.signup, UserController.signup);
v1.post("/user/verify/:verificationcode", UserValidator.verifyUser, UserController.verifyUser);
v1.put("/user/password", middlewares.requiresLogin, UserValidator.changePassword, UserController.changePassword);
v1.get("/user/me", middlewares.requiresLogin, UserController.me);

v1.post("/login", checkHeaders('x-header-organization'), UserValidator.login, UserController.login);

v1.post("/user/password/reset", UserValidator.forgotPassword, UserController.forgotPassword);
v1.get("/user/password/verify/:token", UserController.verifyPasswordToken);
v1.put("/user/password/change/:token", UserValidator.updatePassword, UserController.updatePassword);


// Organization related routes
v1.post("/organization", middlewares.requiresSuperUserToken, OrganizationValidator.createOrganization, OrganizationController.create);
v1.put("/organization", middlewares.requiresSuperUserToken, OrganizationValidator.createOrganization, OrganizationController.create);
v1.get("/organization", middlewares.requiresSuperUserToken, OrganizationController.get);
v1.get("/organization/:id", middlewares.requiresSuperUserToken, OrganizationController.getOrgById);
v1.get("/organization/code/:code", OrganizationController.getOrgByCode);


// Capability related routes
v1.post("/capability", middlewares.requiresSuperUserToken, CapabilityValidator.createCapability, CapabilityController.create);
v1.put("/capability/:id", middlewares.requiresSuperUserToken, CapabilityValidator.createCapability, CapabilityController.updatedCapability);
v1.get("/capability", middlewares.requiresSuperUserToken, CapabilityController.get);
v1.get("/capability/:id", middlewares.requiresSuperUserToken, CapabilityController.getById);


// Role related routes
v1.post("/role", middlewares.requiresSuperUserToken, RoleValidator.createRole, RoleController.create);
v1.put("/role/:id", middlewares.requiresSuperUserToken, RoleValidator.createRole, RoleController.update);
v1.get("/role/organization/:organization", middlewares.requiresSuperUserToken, RoleController.get);
v1.get("/role/:id", middlewares.requiresSuperUserToken, RoleController.getById);

export default v1;