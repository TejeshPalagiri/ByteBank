import { BYTE_BANK_URL } from "@/constants"
import HttpClient from "../http"
import { IFile } from "@/interfaces/File";

export const getAllFiles = (parent?: string) => {
    return HttpClient.get(`${BYTE_BANK_URL}/file`, { params: { parent: parent }});
}

// The following hit will just creates a DB record of the file
export const createFile = (file: IFile) => {
    return HttpClient.post(`${BYTE_BANK_URL}/file`, file);
}

export const fetchPresignedUploadURL = (key: string, mimeType: string) => {
    return HttpClient.post(`${BYTE_BANK_URL}/file/signed-url`, { key: key, mimeType: mimeType });
}

export const getFile = (_id?: string) => {
    if(_id?.length) {
        return HttpClient.get(`${BYTE_BANK_URL}/file/${_id}`);
    }
    return HttpClient.get(`${BYTE_BANK_URL}/file`);
}

export const deleteFile = (_id?: string) => {
    return HttpClient.delete(`${BYTE_BANK_URL}/file/${_id}`);
}