import HttpClient from "../http";
import { API_URL, ORGANIZATION } from "../../constants";

export const login = (userName: string, password: string, organization = ORGANIZATION) => {
    return HttpClient.post(`${API_URL}/login`, { userName: userName, password: password, organization: organization });
}

export const getCurrentUserDetails = () => {
    return HttpClient.get(`${API_URL}/user/me`);
};