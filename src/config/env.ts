import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import _ from "lodash";

if (fs.existsSync(path.join(__dirname, "../../.env"))) {
    console.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: path.join(__dirname, "../../.env") });
} else {
    console.debug(
        "Using .env.example file to supply config environment variables"
    );
    dotenv.config({ path: path.join(__dirname, "../../.env.example") }); // you can delete this after you create your own .env file!
}

export const PORT = process.env.PORT || 3000;
export const ENVIRONMENT = process.env.NODE_ENV || "Development";
export const APP_NAME = process.env.APP_NAME || "Puppy Talks";
export const JWT_ACCESS_TOKEN_SECRET =
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    "JgDatenwishdaj&whwhjq#eushshwj@dhshaDarq";
export const JWT_REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    "JgDatenwishdaj&whwhjq#eushshwj@dhshaDarq";
export const JWT_ACCESS_TOKEN_EXPIRY =
    process.env.JWT_ACCESS_TOKEN_EXPIRY || "10d";
export const JWT_REFRESH_TOKEN_EXPIRY =
    process.env.JWT_REFRESH_TOKEN_EXPIRY || "30d";

// DB Details
export const MONGO_DB_HOST = process.env.MONGO_DB_HOST || "";
export const MONGO_DB_USER = process.env.MONGO_DB_USER || "";
export const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || "";
export const MONGO_DB_DATABASE = process.env.MONGO_DB_DATABASE || "";

// Private keys
export const CRYPTO_PRIVATE_KEY =
    process.env.CRYPTO_PRIVATE_KEY || "GO_H0ME_S@F3LY";

// Super user token
export const SUPER_USER_TOKEN = process.env.SUPER_USER_TOKEN;

// Forgot password token expiry
export const RESET_PASSWORD_EXPIRY = !_.isNaN(parseInt(process.env.RESET_PASSWORD_EXPIRY)) ? parseInt(process.env.RESET_PASSWORD_EXPIRY) : 5;