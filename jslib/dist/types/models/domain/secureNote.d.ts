import { SecureNoteType } from '../../enums/secureNoteType';
import { SecureNoteData } from '../data/secureNoteData';
import Domain from './domain';
declare class SecureNote extends Domain {
    type: SecureNoteType;
    constructor(obj?: SecureNoteData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): any;
}
export { SecureNote };
