class IdentityTokenResponse {
    constructor(response) {
        this.accessToken = response.access_token;
        this.expiresIn = response.expires_in;
        this.refreshToken = response.refresh_token;
        this.tokenType = response.token_type;
        this.privateKey = response.PrivateKey;
        this.key = response.Key;
        this.twoFactorToken = response.TwoFactorToken;
    }
}
export { IdentityTokenResponse };
window.IdentityTokenResponse = IdentityTokenResponse;
//# sourceMappingURL=identityTokenResponse.js.map