import HttpClient from "../http";
import { API_URL, BYTE_BANK_URL } from "../../constants";

export const login = (userName: string, password: string) => {
    return HttpClient.post(`${API_URL}/login`, { userName: userName, password: password });
}

export const getCurrentUserDetails = () => {
    return HttpClient.get(`${API_URL}/user/me`);
};