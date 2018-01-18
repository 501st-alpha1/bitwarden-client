var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CipherType } from '../../enums/cipherType';
import { Attachment } from './attachment';
import { Card } from './card';
import Domain from './domain';
import { Field } from './field';
import { Identity } from './identity';
import { Login } from './login';
import { SecureNote } from './secureNote';
class Cipher extends Domain {
    constructor(obj, alreadyEncrypted = false, localData = null) {
        super();
        if (obj == null) {
            return;
        }
        this.buildDomainModel(this, obj, {
            id: null,
            organizationId: null,
            folderId: null,
            name: null,
            notes: null,
        }, alreadyEncrypted, ['id', 'organizationId', 'folderId']);
        this.type = obj.type;
        this.favorite = obj.favorite;
        this.organizationUseTotp = obj.organizationUseTotp;
        this.edit = obj.edit;
        this.collectionIds = obj.collectionIds;
        this.localData = localData;
        switch (this.type) {
            case CipherType.Login:
                this.login = new Login(obj.login, alreadyEncrypted);
                break;
            case CipherType.SecureNote:
                this.secureNote = new SecureNote(obj.secureNote, alreadyEncrypted);
                break;
            case CipherType.Card:
                this.card = new Card(obj.card, alreadyEncrypted);
                break;
            case CipherType.Identity:
                this.identity = new Identity(obj.identity, alreadyEncrypted);
                break;
            default:
                break;
        }
        if (obj.attachments != null) {
            this.attachments = [];
            obj.attachments.forEach((attachment) => {
                this.attachments.push(new Attachment(attachment, alreadyEncrypted));
            });
        }
        else {
            this.attachments = null;
        }
        if (obj.fields != null) {
            this.fields = [];
            obj.fields.forEach((field) => {
                this.fields.push(new Field(field, alreadyEncrypted));
            });
        }
        else {
            this.fields = null;
        }
    }
    decrypt() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = {
                id: this.id,
                organizationId: this.organizationId,
                folderId: this.folderId,
                favorite: this.favorite,
                type: this.type,
                localData: this.localData,
                login: null,
                card: null,
                identity: null,
                secureNote: null,
                subTitle: null,
                attachments: null,
                fields: null,
                collectionIds: this.collectionIds,
            };
            yield this.decryptObj(model, {
                name: null,
                notes: null,
            }, this.organizationId);
            switch (this.type) {
                case CipherType.Login:
                    model.login = yield this.login.decrypt(this.organizationId);
                    model.subTitle = model.login.username;
                    if (model.login.uri) {
                        const containerService = window.bitwardenContainerService;
                        if (containerService) {
                            const platformUtilsService = containerService.getPlatformUtilsService();
                            model.login.domain = platformUtilsService.getDomain(model.login.uri);
                        }
                        else {
                            throw new Error('window.bitwardenContainerService not initialized.');
                        }
                    }
                    break;
                case CipherType.SecureNote:
                    model.secureNote = yield this.secureNote.decrypt(this.organizationId);
                    model.subTitle = null;
                    break;
                case CipherType.Card:
                    model.card = yield this.card.decrypt(this.organizationId);
                    model.subTitle = model.card.brand;
                    if (model.card.number && model.card.number.length >= 4) {
                        if (model.subTitle !== '') {
                            model.subTitle += ', ';
                        }
                        model.subTitle += ('*' + model.card.number.substr(model.card.number.length - 4));
                    }
                    break;
                case CipherType.Identity:
                    model.identity = yield this.identity.decrypt(this.organizationId);
                    model.subTitle = '';
                    if (model.identity.firstName) {
                        model.subTitle = model.identity.firstName;
                    }
                    if (model.identity.lastName) {
                        if (model.subTitle !== '') {
                            model.subTitle += ' ';
                        }
                        model.subTitle += model.identity.lastName;
                    }
                    break;
                default:
                    break;
            }
            const orgId = this.organizationId;
            if (this.attachments != null && this.attachments.length > 0) {
                const attachments = [];
                yield this.attachments.reduce((promise, attachment) => {
                    return promise.then(() => {
                        return attachment.decrypt(orgId);
                    }).then((decAttachment) => {
                        attachments.push(decAttachment);
                    });
                }, Promise.resolve());
                model.attachments = attachments;
            }
            if (this.fields != null && this.fields.length > 0) {
                const fields = [];
                yield this.fields.reduce((promise, field) => {
                    return promise.then(() => {
                        return field.decrypt(orgId);
                    }).then((decField) => {
                        fields.push(decField);
                    });
                }, Promise.resolve());
                model.fields = fields;
            }
            return model;
        });
    }
}
export { Cipher };
window.Cipher = Cipher;
//# sourceMappingURL=cipher.js.map