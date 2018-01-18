import { CipherType } from '../../enums/cipherType';
import { AttachmentData } from './attachmentData';
import { CardData } from './cardData';
import { FieldData } from './fieldData';
import { IdentityData } from './identityData';
import { LoginData } from './loginData';
import { SecureNoteData } from './secureNoteData';
class CipherData {
    constructor(response, userId, collectionIds) {
        this.id = response.id;
        this.organizationId = response.organizationId;
        this.folderId = response.folderId;
        this.userId = userId;
        this.edit = response.edit;
        this.organizationUseTotp = response.organizationUseTotp;
        this.favorite = response.favorite;
        this.revisionDate = response.revisionDate;
        this.type = response.type;
        if (collectionIds != null) {
            this.collectionIds = collectionIds;
        }
        else {
            this.collectionIds = response.collectionIds;
        }
        this.name = response.data.Name;
        this.notes = response.data.Notes;
        switch (this.type) {
            case CipherType.Login:
                this.login = new LoginData(response.data);
                break;
            case CipherType.SecureNote:
                this.secureNote = new SecureNoteData(response.data);
                break;
            case CipherType.Card:
                this.card = new CardData(response.data);
                break;
            case CipherType.Identity:
                this.identity = new IdentityData(response.data);
                break;
            default:
                break;
        }
        if (response.data.Fields != null) {
            this.fields = [];
            response.data.Fields.forEach((field) => {
                this.fields.push(new FieldData(field));
            });
        }
        if (response.attachments != null) {
            this.attachments = [];
            response.attachments.forEach((attachment) => {
                this.attachments.push(new AttachmentData(attachment));
            });
        }
    }
}
export { CipherData };
window.CipherData = CipherData;
//# sourceMappingURL=cipherData.js.map