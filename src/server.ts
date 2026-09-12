import "./newrelic-init";

import http from "http";

import app from "./app";
import * as config from "./config";
import logger from "./utils/logger";

const port = config.PORT;
app.set("port", port);

// Create server
export const server = http.createServer(app);

server.listen(config.PORT, () => {
    logger.info(
        `Server started listening on Port: ${config.PORT} in ${config.ENVIRONMENT} mode`
    );
});

server.on("error", (error) => {
    logger.error({ error }, "Error occured in the server");
});