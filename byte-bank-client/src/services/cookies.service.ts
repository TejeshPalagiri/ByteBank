import Cookies from "js-cookie";

export const saveToken = (
    type: "ACCESS_TOKEN" | "REFRESH_TOKEN",
    token: string
) => {
    switch (type) {
        case "ACCESS_TOKEN":
            Cookies.set("access-token", token);
            break;
        case "REFRESH_TOKEN":
            Cookies.set("refresh-token", token);
            break;
    }
};

export const getToken = (type: "ACCESS_TOKEN" | "REFRESH_TOKEN") => {
    switch (type) {
        case "ACCESS_TOKEN":
            return Cookies.get("access-token");
        case "REFRESH_TOKEN":
            return Cookies.get("refresh-token");
    }
};

export const saveUserSessionStatus = (status: string) => {
    Cookies.set("isLoggedIn", status);
};

export const getUserSessionStatus = () => {
    return Cookies.get("isLoggedIn");
};

export const getCookies = (key?: string) => {
    if (key) {
        return Cookies.get(key);
    }
    return Cookies.get();
};

export const deleteCookies = (keys: string | Array<string>, options = {}) => {
    if (!Array.isArray(keys)) {
        keys = [keys];
    }

    for (let k of keys) {
        Cookies.remove(k, options);
    }
};

export const saveMiscTokens = (
    type: "ORGANIZATION" | "SPACE",
    token: string
) => {
    switch (type) {
        case "ORGANIZATION":
            Cookies.set("organization", token);
            break;
        case "SPACE":
            Cookies.set("space", token);
            break;
    }
}

export const getMiscTokens = (
    type: "ORGANIZATION" | "SPACE"
) => {
    switch (type) {
        case "ORGANIZATION":
            return Cookies.get("organization");
        case "SPACE":
            return Cookies.get("space");
    }
}