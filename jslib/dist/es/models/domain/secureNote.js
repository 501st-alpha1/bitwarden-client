import Domain from './domain';
class SecureNote extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
    }
    decrypt(orgId) {
        return {
            type: this.type,
        };
    }
}
export { SecureNote };
window.SecureNote = SecureNote;
//# sourceMappingURL=secureNote.js.map