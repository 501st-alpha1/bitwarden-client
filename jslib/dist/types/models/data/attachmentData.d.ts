import { AttachmentResponse } from '../response/attachmentResponse';
declare class AttachmentData {
    id: string;
    url: string;
    fileName: string;
    size: number;
    sizeName: string;
    constructor(response: AttachmentResponse);
}
export { AttachmentData };
