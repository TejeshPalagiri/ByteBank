import axios from "axios";
import * as constants from "../constants";
import * as CookieService from "./cookies.service";
import * as SharedService from "./shared.service";

const HttpClient = axios.create({
    baseURL: `${constants.SERVER_URL}${constants.API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

HttpClient.interceptors.request.use(
    function (config) {
        const accessToken = CookieService.getToken("ACCESS_TOKEN");
        const refreshToken = CookieService.getToken("REFRESH_TOKEN");

        if (accessToken) {
            config.headers["x-header-accesstoken"] = accessToken;
        }

        if (refreshToken) {
            config.headers["x-header-refreshtoken"] = refreshToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

HttpClient.interceptors.response.use(
    (response) => {
        if (response.headers["x-header-accesstoken"]) {
            CookieService.saveToken(
                "ACCESS_TOKEN",
                response.headers["x-header-accesstoken"]
            );
        }
        if (response.headers["x-header-refreshtoken"]) {
            CookieService.saveToken(
                "REFRESH_TOKEN",
                response.headers["x-header-refreshtoken"]
            );
        }
        if (response.status >= 200 && response.status <= 300) {
            // Show some success notification
            // SharedService.OpenToast("SUCCESS", response?.data?.message);
        }
        return response.data;
    },
    (error) => {
        const response = error.response;
        if (response.status === 401) {
            // SharedService.useLogout();
        } else if (response.status === 400) {
            SharedService.OpenToast("ERROR", response?.data?.message);
        } else if (response.status === 500) {
            SharedService.OpenToast("INFO", "Internal server error occured.", {
                backgroundColor: "red",
            });
        } else if (response.status === 404) {
            SharedService.OpenToast("INFO", "Can't found the acceed resource.");
        }

        return Promise.reject(error);
    }
);

export default HttpClient;
