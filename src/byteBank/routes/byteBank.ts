import { NextFunction, Response, Router, Request } from "express";

// Middlewares
import { requiresLogin } from "../../middlewares/Authorization";
import { checkHeaders } from "../../middlewares/headers.middleware";

// Validators
import * as SpaceValidator from "../validators/space.validator";
import * as FolderValidator from "../validators/folder.validator";

// Controllers
import * as SpaceController from "../controllers/space.controller";
import * as FolderController from "../controllers/folder.controller";
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

// Folder related routes
byteBankRouter.get("/folder", checkHeaders('x-header-organization'), checkHeaders('x-header-space'), requiresLogin, FolderController.getFolders);
byteBankRouter.get("/folder/:id", checkHeaders('x-header-organization'), checkHeaders('x-header-space'), requiresLogin, FolderController.getFolderById);
byteBankRouter.post("/folder", checkHeaders('x-header-organization'), checkHeaders('x-header-space'), requiresLogin, SpaceValidator.createSpace, FolderController.createFolder);
byteBankRouter.put("/folder/:id", checkHeaders('x-header-organization'), checkHeaders('x-header-space'), requiresLogin, SpaceValidator.createSpace, FolderController.updateFolder);

export default byteBankRouter;