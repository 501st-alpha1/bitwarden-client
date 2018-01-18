import Domain from './domain';
class Login extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            uri: null,
            username: null,
            password: null,
            totp: null,
        }, alreadyEncrypted, []);
    }
    decrypt(orgId) {
        return this.decryptObj({}, {
            uri: null,
            username: null,
            password: null,
            totp: null,
        }, orgId);
    }
}
export { Login };
window.Login = Login;
//# sourceMappingURL=login.js.map