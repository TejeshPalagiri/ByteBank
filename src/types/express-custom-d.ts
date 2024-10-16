declare namespace Express {
    export interface Request {
        currentUser: any;
        requestId: string;
    }
}