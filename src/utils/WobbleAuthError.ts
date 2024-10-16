export default class WobbleAuthError extends Error {
    status: number = 500;
    data: any = {};

    constructor(status: number, message: string, data?: any) {
        super(message);
        if (this.status) {
            this.status = status;
        }
        if(data) {
            this.data = data;
        }
    }
}