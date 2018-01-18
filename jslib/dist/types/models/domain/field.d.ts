import { FieldType } from '../../enums/fieldType';
import { FieldData } from '../data/fieldData';
import { CipherString } from './cipherString';
import Domain from './domain';
declare class Field extends Domain {
    name: CipherString;
    vault: CipherString;
    type: FieldType;
    constructor(obj?: FieldData, alreadyEncrypted?: boolean);
    decrypt(orgId: string): Promise<any>;
}
export { Field };
