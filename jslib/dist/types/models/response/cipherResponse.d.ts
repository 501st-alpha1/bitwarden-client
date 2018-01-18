import { AttachmentResponse } from './attachmentResponse';
declare class CipherResponse {
    id: string;
    organizationId: string;
    folderId: string;
    type: number;
    favorite: boolean;
    edit: boolean;
    organizationUseTotp: boolean;
    data: any;
    revisionDate: string;
    attachments: AttachmentResponse[];
    collectionIds: string[];
    constructor(response: any);
}
export { CipherResponse };
