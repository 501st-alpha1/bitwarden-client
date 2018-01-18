import Domain from './domain';
class Field extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.type = obj.type;
        this.buildDomainModel(this, obj, {
            name: null,
            value: null,
        }, alreadyEncrypted, []);
    }
    decrypt(orgId) {
        const model = {
            type: this.type,
        };
        return this.decryptObj(model, {
            name: null,
            value: null,
        }, orgId);
    }
}
export { Field };
window.Field = Field;
//# sourceMappingURL=field.js.map