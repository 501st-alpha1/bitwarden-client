class LoginData {
    constructor(data) {
        this.uri = data.Uri;
        this.username = data.Username;
        this.password = data.Password;
        this.totp = data.Totp;
    }
}
export { LoginData };
window.LoginData = LoginData;
//# sourceMappingURL=loginData.js.map