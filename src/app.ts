require('./config/database/mongo');
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import * as config from "./config";
import * as cryptoService from "./utils/crypto";
import WobbleAuthError from "./utils/WobbleAuthError";
import v1 from "./routers/v1";

const app = express();
const corsOptions = {};
app.use(cookieParser());

// Middlewares
app.set("port", config.PORT);
app.set("trust proxy", true)
app.use(cors(corsOptions));
app.use(express.json());

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.ip;
    req.ipAddress = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;
    req.requestId = cryptoService.generateRandomId(16);
    req.userAgent = req.headers['user-agent'];
    console.log(`${req.requestId} : ${req.method}: ${req.originalUrl}`);
    res.setHeader('Access-Control-Expose-Headers', 'x-header-accesstoken, x-header-refreshtoken');
    next();
};
app.use(requestLogger);
app.use("/api/v1", v1);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(
        `Server is up and running on version: ${config.version}`
    );
});

// 404 not found catcher
app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const err = new WobbleAuthError(404, "Not Found");
        next(err);
    }
);

// error handler
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "dev" ? err : {};

        // error message
        const response =
            req.app.get("env") === "dev"
                ? {
                    success: false,
                    message: err.message,
                    code: err.code ? err.code : "",
                    stack: err.stack,
                    requestId: req.requestId,
                    data: err.data
                }
                : {
                    success: false,
                    message: err.message,
                    status: err.status || 500,
                    code: err.code ? err.code : "",
                    requestId: req.requestId,
                    data: err.data
                };

        // send error message
        res.status(err.status || 500);
        res.send(response);
    }
);

export default app;