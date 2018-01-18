import Domain from './domain';
class Folder extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            name: null,
        }, alreadyEncrypted, ['id']);
    }
    decrypt() {
        const model = {
            id: this.id,
        };
        return this.decryptObj(model, {
            name: null,
        }, null);
    }
}
export { Folder };
window.Folder = Folder;
//# sourceMappingURL=folder.js.map