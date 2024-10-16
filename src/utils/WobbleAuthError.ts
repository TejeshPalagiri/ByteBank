export default class WobbleAuthError extends Error {
    status: number = 500;

    constructor(status: number, message: string) {
        super(message);
        if (this.status) {
            this.status = status;
        }
    }
}