import { FolderData } from '../data/folderData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Folder extends Domain {
    id: string;
    name: CipherString;
    constructor(obj?: FolderData, alreadyEncrypted?: boolean);
    decrypt(): Promise<any>;
}
export { Folder };
