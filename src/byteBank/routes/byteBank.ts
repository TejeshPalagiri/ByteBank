import { NextFunction, Response, Router, Request } from "express";

// Middlewares
import { requiresLogin } from "../../middlewares/Authorization";
import { checkHeaders } from "../../middlewares/headers.middleware";

// Validators
import * as SpaceValidator from "../validators/space.validator";

// Controllers
import * as SpaceController from "../controllers/space.controller";

const byteBankRouter = Router();

byteBankRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        sucess: true,
        message: "Hey! Welcome to the Byte Bank."
    })
    // TODO: We need to redirect the user to some web page.
})

// Space related routes
byteBankRouter.get("/space", checkHeaders('x-header-organization'), requiresLogin, SpaceController.getSpaces);
byteBankRouter.get("/space/:id", checkHeaders('x-header-organization'), requiresLogin, SpaceController.getSpaceById);
byteBankRouter.post("/space", checkHeaders('x-header-organization'), requiresLogin, SpaceValidator.createSpace, SpaceController.createSpace);
byteBankRouter.put("/space/:id", checkHeaders('x-header-organization'), requiresLogin, SpaceValidator.createSpace, SpaceController.updateSpace);

export default byteBankRouter;