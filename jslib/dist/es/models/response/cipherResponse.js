import { AttachmentResponse } from './attachmentResponse';
class CipherResponse {
    constructor(response) {
        this.id = response.Id;
        this.organizationId = response.OrganizationId;
        this.folderId = response.FolderId;
        this.type = response.Type;
        this.favorite = response.Favorite;
        this.edit = response.Edit;
        this.organizationUseTotp = response.OrganizationUseTotp;
        this.data = response.Data;
        this.revisionDate = response.RevisionDate;
        if (response.Attachments != null) {
            this.attachments = [];
            response.Attachments.forEach((attachment) => {
                this.attachments.push(new AttachmentResponse(attachment));
            });
        }
        if (response.CollectionIds) {
            this.collectionIds = [];
            response.CollectionIds.forEach((id) => {
                this.collectionIds.push(id);
            });
        }
    }
}
export { CipherResponse };
window.CipherResponse = CipherResponse;
//# sourceMappingURL=cipherResponse.js.map