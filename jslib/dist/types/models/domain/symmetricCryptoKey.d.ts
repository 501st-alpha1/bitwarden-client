import { EncryptionType } from '../../enums/encryptionType';
import { SymmetricCryptoKeyBuffers } from './symmetricCryptoKeyBuffers';
export declare class SymmetricCryptoKey {
    key: string;
    keyB64: string;
    encKey: string;
    macKey: string;
    encType: EncryptionType;
    keyBuf: SymmetricCryptoKeyBuffers;
    constructor(keyBytes: string, b64KeyBytes?: boolean, encType?: EncryptionType);
    getBuffers(): SymmetricCryptoKeyBuffers;
}
