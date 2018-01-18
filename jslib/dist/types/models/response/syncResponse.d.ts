import { CipherResponse } from './cipherResponse';
import { CollectionResponse } from './collectionResponse';
import { DomainsResponse } from './domainsResponse';
import { FolderResponse } from './folderResponse';
import { ProfileResponse } from './profileResponse';
declare class SyncResponse {
    profile?: ProfileResponse;
    folders: FolderResponse[];
    collections: CollectionResponse[];
    ciphers: CipherResponse[];
    domains?: DomainsResponse;
    constructor(response: any);
}
export { SyncResponse };
