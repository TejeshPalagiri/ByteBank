import { NextFunction, Response, Router, Request } from "express";

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

export default v1;