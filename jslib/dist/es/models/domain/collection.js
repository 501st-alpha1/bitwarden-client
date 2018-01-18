import Domain from './domain';
class Collection extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            organizationId: null,
            name: null,
        }, alreadyEncrypted, ['id', 'organizationId']);
    }
    decrypt() {
        const model = {
            id: this.id,
            organizationId: this.organizationId,
        };
        return this.decryptObj(model, {
            name: null,
        }, this.organizationId);
    }
}
export { Collection };
window.Collection = Collection;
//# sourceMappingURL=collection.js.map