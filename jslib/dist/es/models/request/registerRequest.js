class RegisterRequest {
    constructor(email, masterPasswordHash, masterPasswordHint, key) {
        this.name = null;
        this.email = email;
        this.masterPasswordHash = masterPasswordHash;
        this.masterPasswordHint = masterPasswordHint ? masterPasswordHint : null;
        this.key = key;
    }
}
export { RegisterRequest };
window.RegisterRequest = RegisterRequest;
//# sourceMappingURL=registerRequest.js.map