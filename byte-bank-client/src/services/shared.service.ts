import { useNavigate } from "react-router-dom";
import * as CookieService from "./cookies.service";
import { toast } from "react-toast";
import { ToastConfig } from "react-toast/dist/types";

export const OpenToast = (
    type: "SUCCESS" | "ERROR" | "INFO" | "WARNING",
    message: string,
    options: ToastConfig = {}
) => {
    switch (type) {
        case "SUCCESS":
            toast.success(message, options);
            break;
        case "ERROR":
            toast.error(message, options);
            break;
        case "INFO":
            toast.info(message, options);
            break;
        case "WARNING":
            toast.warn(message, options);
            break;
    }
};

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // TODO: for now deleting all the saved cookies
        performLogout();
        navigate("/");
    };

    return logout();
};

export const performLogout = () => {
    const cookies = CookieService.getCookies();
    if (cookies) {
        CookieService.deleteCookies(Object.keys(cookies));
    }
    window.location.href = "/#/login";
}

export const saveDataInLocalstorage = (key: string, value: any) => {
    if(typeof value !== "string") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
}

export const getDataFromLocalstorage = (key: string) => {
    return localStorage.getItem(key)
}
