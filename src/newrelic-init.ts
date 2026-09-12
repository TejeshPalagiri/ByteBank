import dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (fs.existsSync(path.join(__dirname, "../.env"))) {
    dotenv.config({ path: path.join(__dirname, "../.env") });
} else {
    dotenv.config({ path: path.join(__dirname, "../.env.example") });
}

if (process.env.NEWRELIC_ENABLED === "true") {
    if (!process.env.NEWRELIC_APP_NAME || !process.env.NEW_RELIC_LICENSE_KEY) {
        console.error("New Relic is enabled but app name or license key is missing");
    } else {
        require("newrelic");
    }
}
