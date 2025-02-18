import { BYTE_BANK_URL } from "@/constants"
import HttpClient from "../http"
import { IFolder } from "@/interfaces/Folder"

export const getAllFolders = (id?:string) => {
    if(id?.length) {
        return HttpClient.get(`${BYTE_BANK_URL}/folder/${id}`)
    }
    return HttpClient.get(`${BYTE_BANK_URL}/folder`)
}

export const createFolder = (folder: IFolder) => {
    return HttpClient.post(`${BYTE_BANK_URL}/folder`, folder);
}

export const updatedFolder = (_id: string, folder: IFolder) => {
    return HttpClient.put(`${BYTE_BANK_URL}/folder/${_id}`, folder);
}

export const deleteFolder = (_id: string) => {
    return HttpClient.delete(`${BYTE_BANK_URL}/folder/${_id}`);
}