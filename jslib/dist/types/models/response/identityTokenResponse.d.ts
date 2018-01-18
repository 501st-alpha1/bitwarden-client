declare class IdentityTokenResponse {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    tokenType: string;
    privateKey: string;
    key: string;
    twoFactorToken: string;
    constructor(response: any);
}
export { IdentityTokenResponse };
