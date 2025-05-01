const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mime = require("mime-types");

const axiosClient = axios.create({
    baseURL: "http://localhost:3000/api/byte-bank",
    headers: {
        "x-header-organization": "67265f77c6a1d544997097ee",
        "x-header-accesstoken":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MWJkYTg1YjJlYjgzM2I2MTAyZDMzMmRhMjc0YzA1OjJhZTM3OTRhMjIwMWU2ZjU1ZTdiNmZiNTBhYmZlZmI0Y2Y0YzNhNTAwYmQxNjczYmIyMjkxMjczOGJiOGM0MGYiLCJzZXNzaW9uIjoiNjgwZTY0ZTgzYmM5ZGQzOTFmMWJkZTk5IiwiaWF0IjoxNzQ1NzczODAwLCJleHAiOjE3NDY2Mzc4MDB9.IjzsFaBhsGRwHU7HF3h8hjWpp5AdGf4GDIGgVzFDMGU",
        "x-header-refreshtoken":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MWJkYTg1YjJlYjgzM2I2MTAyZDMzMmRhMjc0YzA1OjJhZTM3OTRhMjIwMWU2ZjU1ZTdiNmZiNTBhYmZlZmI0Y2Y0YzNhNTAwYmQxNjczYmIyMjkxMjczOGJiOGM0MGYiLCJzZXNzaW9uIjoiNjgwZTY0ZTgzYmM5ZGQzOTFmMWJkZTk5IiwiaWF0IjoxNzQ1NzczODAwLCJleHAiOjE3NDgzNjU4MDB9.8cC8mEdSSQppEq-mWyAL_5IvvO7L5KR4b4zGDPqz4Oc",
        "x-header-space": "6767ad77a0914526781018b5",
    },
});

async function fetchFileUploadUrl(filePath, key) {
    try {
        const fileName = path.basename(filePath);
        const mimeType = mime.lookup(filePath);
        const payload = {
            key: key,
            mimeType: "video/mp4" || mimeType || "application/octet-stream", // Default if MIME type is not found
        };
        // {{BYTE_BANK_URL}}/file/signed-url
        const response = await axiosClient.post("/file/signed-url", payload);
        if (response.status === 200) {
            return response.data.data.url;
        } else {
            throw new Error("Failed to fetch upload URL");
        }
    } catch (error) {
        console.error("Error fetching upload URL:", error);
        throw error;
    }
}


async function uploadFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const mimeType = mime.lookup(filePath);
        const payload = {
            name: fileName,
            description: "Test file upload",
            mimeType: "video/mp4" || mimeType || "application/octet-stream", // Default if MIME type is not found
            size: fileContent.length,
            parent: "6813118fe7fa07335ebcd50d"
        };
        const fileResponse = await axiosClient.post("/file", payload);
        const key = fileResponse.data.data[0].key;
        const id = fileResponse.data.data[0].id;
        if(fileResponse.status === 200) {
            try {
                const uploadUrl = await fetchFileUploadUrl(filePath, key);
                const uploadFIleUsingSignedUrl = await axios.put(uploadUrl, fileContent, {
                    headers: {
                        "Content-Type": "video/mp4" || mimeType || "application/octet-stream", // Default if MIME type is not found
                    },
                });
                console.log("File uploaded successfully:", fileName);
            } catch (error) {
                console.error("Error while getting file id", error);
                await axiosClient.delete(`/file/${id}`);
            }
        }
    } catch (error) {
        console.error("ERROR  while getting files", error);
    }
}

async function main() {
    try {
        const failedFiles = [];
        const folderPath = path.resolve(
            __dirname,
            "../../../Moto_Edge_50_fusion/BKP_26_04_2025/Camera/Videos/Missing"
        );
        // await uploadFile(folderPath);
        const files = fs.readdirSync(folderPath);
        for (let file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                try {
                    await uploadFile(filePath);
                    // console.log("Uploaded file successfully:", file);
                } catch (error) {
                    console.error("Failed to upload file:", file, error);
                    failedFiles.push(file);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


main();
