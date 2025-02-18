import { BYTE_BANK_URL } from "@/constants";
import HttpClient from "../http";
import { ISpace } from "@/interfaces/Space";

export const getAllSpaces = (id?: string) => {
    if (id?.length) {
        return HttpClient.get(`${BYTE_BANK_URL}/space/${id}`);
    }
    return HttpClient.get(`${BYTE_BANK_URL}/space`);
};

export const createSpace = (space: ISpace, id?: string) => {
    if(id?.length) {
        return HttpClient.put(`${BYTE_BANK_URL}/space/${id}`, space);
    }
    return HttpClient.post(`${BYTE_BANK_URL}/space`, space);
};

export const deleteSpace = (_id: string) => {
    return HttpClient.delete(`${BYTE_BANK_URL}/space/${_id}`);
}