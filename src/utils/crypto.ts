import * as config from "../config";
import crypto from "crypto";

const outputEncoding = "hex";

export const encrypt = (payload: string) => {
    const iv = Buffer.from(crypto.randomBytes(16));
    const key = crypto
        .createHash("sha256")
        .update(String(config.CRYPTO_PRIVATE_KEY))
        .digest("base64")
        .substr(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(payload);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return (
        iv.toString(outputEncoding) + ":" + encrypted.toString(outputEncoding)
    );
};

export const decrypt = (text: string) => {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), outputEncoding);
    const encryptedText = Buffer.from(textParts.join(":"), outputEncoding);
    const key = crypto
        .createHash("sha256")
        .update(String(config.CRYPTO_PRIVATE_KEY))
        .digest("base64")
        .substr(0, 32);
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

export const generateRandomId = (length: number = 4) => {
    return crypto.randomBytes(length).toString("hex");
};