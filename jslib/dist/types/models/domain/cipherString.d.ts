import { EncryptionType } from '../../enums/encryptionType';
declare class CipherString {
    encryptedString?: string;
    encryptionType?: EncryptionType;
    decryptedValue?: string;
    cipherText?: string;
    initializationVector?: string;
    mac?: string;
    constructor(encryptedStringOrType: string | EncryptionType, ct?: string, iv?: string, mac?: string);
    decrypt(orgId: string): Promise<string>;
}
export { CipherString };
