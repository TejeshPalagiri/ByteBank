export const COMMON = {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    URL: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
}

export const ORGANIZATION_NAME_MAX_LENGTH = 50;
export const ORGANIZATION_NAME_MIN_LENGTH = 6;
export const ORGANIZATION_CODE_MAX_LENGTH = 6;
export const ORGANIZATION_CODE_MIN_LENGTH = 3;

export const USERNAME_MAX_LENGTH = 16;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,16}$/;
export const USER_PASSWORD_MAX_LENGTH = 18;
export const USER_PASSWORD_MIN_LENGTH = 8;
export const USER_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
export const USER_EMAIL_MIN_LENGTH = 6;
export const USER_EMAIL_MAX_LENGTH = 60;