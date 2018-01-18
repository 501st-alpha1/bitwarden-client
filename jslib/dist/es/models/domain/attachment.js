import Domain from './domain';
class Attachment extends Domain {
    constructor(obj, alreadyEncrypted = false) {
        super();
        if (obj == null) {
            return;
        }
        this.size = obj.size;
        this.buildDomainModel(this, obj, {
            id: null,
            url: null,
            sizeName: null,
            fileName: null,
        }, alreadyEncrypted, ['id', 'url', 'sizeName']);
    }
    decrypt(orgId) {
        const model = {
            id: this.id,
            size: this.size,
            sizeName: this.sizeName,
            url: this.url,
        };
        return this.decryptObj(model, {
            fileName: null,
        }, orgId);
    }
}
export { Attachment };
window.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map