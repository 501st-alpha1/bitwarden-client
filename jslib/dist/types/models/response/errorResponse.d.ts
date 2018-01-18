declare class ErrorResponse {
    message: string;
    validationErrors: {
        [key: string]: string[];
    };
    statusCode: number;
    constructor(response: any, status: number, identityResponse?: boolean);
    getSingleMessage(): string;
}
export { ErrorResponse };
