import pino from "pino";

const isDevelopment = (process.env.NODE_ENV || "Development").toLowerCase() === "development";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: isDevelopment
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
});

export default logger;
