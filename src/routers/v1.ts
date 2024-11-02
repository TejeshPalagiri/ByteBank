import { NextFunction, Response, Router, Request } from "express";

// Validators
import * as UserValidator from "../validators/user.validator";
import * as OrganizationValidator from "../validators/organization.validator";

// Controllers
import * as UserController from "../controllers/user.controller";
import * as OrganizationController from "../controllers/organization.controller";

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

export default v1;