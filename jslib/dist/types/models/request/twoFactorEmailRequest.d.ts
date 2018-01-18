declare class TwoFactorEmailRequest {
    email: string;
    masterPasswordHash: string;
    constructor(email: string, masterPasswordHash: string);
}
export { TwoFactorEmailRequest };
