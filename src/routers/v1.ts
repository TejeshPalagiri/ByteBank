import { NextFunction, Response, Router, Request } from "express";

// Validators
import * as UserValidator from "../validators/user.validator";
import * as OrganizationValidator from "../validators/organization.validator";
import * as CapabilityValidator from "../validators/capability.validator";

// Controllers
import * as UserController from "../controllers/user.controller";
import * as OrganizationController from "../controllers/organization.controller";
import * as CapabilityController from "../controllers/capability.controller";

// Middlewares
import * as middlewares from "../middlewares/Authorization";

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


v1.post("/user", UserValidator.signup, UserController.login)




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


export default v1;