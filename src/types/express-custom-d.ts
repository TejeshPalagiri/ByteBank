declare namespace Express {
    export interface Request {
        currentUser: any;
        requestId: string;
        ipAddress: string;
        organization: string;
        userAgent: string;
    }
}