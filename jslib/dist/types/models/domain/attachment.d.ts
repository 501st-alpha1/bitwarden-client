import { AttachmentData } from '../data/attachmentData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Attachment extends Domain {
    id: string;
    url: string;
    size: number;
    sizeName: string;
    fileName: CipherString;
    constructor(obj?: AttachmentData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<any>;
}
export { Attachment };
