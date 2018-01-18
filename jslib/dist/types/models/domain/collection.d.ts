import { CollectionData } from '../data/collectionData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Collection extends Domain {
    id: string;
    organizationId: string;
    name: CipherString;
    constructor(obj?: CollectionData, alreadyEncrypted?: boolean);
    decrypt(): Promise<any>;
}
export { Collection };
