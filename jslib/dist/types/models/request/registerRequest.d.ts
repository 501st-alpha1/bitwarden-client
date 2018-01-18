declare class RegisterRequest {
    name: string;
    email: string;
    masterPasswordHash: string;
    masterPasswordHint: string;
    key: string;
    constructor(email: string, masterPasswordHash: string, masterPasswordHint: string, key: string);
}
export { RegisterRequest };
