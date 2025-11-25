const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mime = require("mime-types");

const axiosClient = axios.create({
    baseURL: "http://localhost:3001/api/byte-bank",
    headers: {
        "x-header-organization": "67265f77c6a1d544997097ee",
        "x-header-accesstoken":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwY2E4NTc3YjgzYzU1ODU4NGIyN2ZlM2JiZWY2YWQxOmJlOTBjMjUxYTk5NmMzN2QyNDRjN2RkNWZhZTIyMmMyNTMyYzQ4OTExZjlmZjA0YjUwMjIzYTM5YmVkNTFmOTQiLCJzZXNzaW9uIjoiNjkyMTBjZTFhYWE1NjIyNjhjMjRlODIzIiwiaWF0IjoxNzYzNzczNjY1LCJleHAiOjE3NjQ2Mzc2NjV9.Q_8SJU0uC9cjFYYy9GGBF_1J_OzFr9eJBqSARkTaOvM",
        "x-header-refreshtoken":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwY2E4NTc3YjgzYzU1ODU4NGIyN2ZlM2JiZWY2YWQxOmJlOTBjMjUxYTk5NmMzN2QyNDRjN2RkNWZhZTIyMmMyNTMyYzQ4OTExZjlmZjA0YjUwMjIzYTM5YmVkNTFmOTQiLCJzZXNzaW9uIjoiNjkyMTBjZTFhYWE1NjIyNjhjMjRlODIzIiwiaWF0IjoxNzYzNzczNjY1LCJleHAiOjE3NjU1MDE2NjV9.Iz5bUuJ4f5crZkijiVoJSJZkSGV9afODSPNyl04nHDI",
        "x-header-space": "6767ad77a0914526781018b5",
    },
});

async function fetchFileUploadUrl(filePath, key) {
    try {
        const fileName = path.basename(filePath);
        const mimeType = mime.lookup(filePath)?.includes("mp4") ? "video/mp4" : mime.lookup(filePath);
        const payload = {
            key: key,
            mimeType: mimeType || "application/octet-stream", // Default if MIME type is not found
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
        const mimeType = mime.lookup(filePath)?.includes("mp4") ? "video/mp4" : mime.lookup(filePath);
        const payload = {
            name: fileName,
            description: "Test file upload",
            mimeType: mimeType || "application/octet-stream", // Default if MIME type is not found
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
                        "Content-Type": mimeType || "application/octet-stream", // Default if MIME type is not found
                    },
                });
                console.log("File uploaded successfully:", fileName);
            } catch (error) {
                console.error("Error while getting file id", error);
                await axiosClient.delete(`/file/${id}`);
            }
        }
    } catch (error) {
        throw error;
        console.error("ERROR  while getting files", error);
    }
}

async function getFileByName(name) {
    let file;
    if(name?.length) {
        file = await axiosClient.get(`/file/${name}`);
        return file?.data?.data?._id;
    }
    return file;
}

async function main() {
    const failedFiles = [];
    const newlyUploadedFiles = [];
    try {
        const folderPath = path.resolve(
            __dirname,
            "../Moto"
        );
        // await uploadFile(folderPath);
        const files = fs.readdirSync(folderPath);
        files.splice(0, 1);
        for (let file of files) {
            const dbFile = await getFileByName(file);
            if(!dbFile) {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    try {
                        await uploadFile(filePath);
                        newlyUploadedFiles.push(file);
                        // console.log("Uploaded file successfully:", file);
                    } catch (error) {
                        console.error("Failed to upload file:", file, error);
                        failedFiles.push(file);
                    }
                }
            }
            
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        console.log("NEWLY UPLOADED FILES", JSON.stringify(newlyUploadedFiles, null, 2));
        console.log("Failed uploading files", JSON.stringify(failedFiles, null, 2))
    }
}


main();
