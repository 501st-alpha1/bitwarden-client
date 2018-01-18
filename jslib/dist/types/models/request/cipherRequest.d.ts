import { CipherType } from '../../enums/cipherType';
declare class CipherRequest {
    type: CipherType;
    folderId: string;
    organizationId: string;
    name: string;
    notes: string;
    favorite: boolean;
    login: any;
    secureNote: any;
    card: any;
    identity: any;
    fields: any[];
    constructor(cipher: any);
}
export { CipherRequest };
