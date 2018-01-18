import { EncryptionType } from '../../enums/encryptionType';
class CipherString {
    constructor(encryptedStringOrType, ct, iv, mac) {
        if (ct != null) {
            // ct and header
            const encType = encryptedStringOrType;
            this.encryptedString = encType + '.' + ct;
            // iv
            if (iv != null) {
                this.encryptedString += ('|' + iv);
            }
            // mac
            if (mac != null) {
                this.encryptedString += ('|' + mac);
            }
            this.encryptionType = encType;
            this.cipherText = ct;
            this.initializationVector = iv;
            this.mac = mac;
            return;
        }
        this.encryptedString = encryptedStringOrType;
        if (!this.encryptedString) {
            return;
        }
        const headerPieces = this.encryptedString.split('.');
        let encPieces = null;
        if (headerPieces.length === 2) {
            try {
                this.encryptionType = parseInt(headerPieces[0], null);
                encPieces = headerPieces[1].split('|');
            }
            catch (e) {
                return;
            }
        }
        else {
            encPieces = this.encryptedString.split('|');
            this.encryptionType = encPieces.length === 3 ? EncryptionType.AesCbc128_HmacSha256_B64 :
                EncryptionType.AesCbc256_B64;
        }
        switch (this.encryptionType) {
            case EncryptionType.AesCbc128_HmacSha256_B64:
            case EncryptionType.AesCbc256_HmacSha256_B64:
                if (encPieces.length !== 3) {
                    return;
                }
                this.initializationVector = encPieces[0];
                this.cipherText = encPieces[1];
                this.mac = encPieces[2];
                break;
            case EncryptionType.AesCbc256_B64:
                if (encPieces.length !== 2) {
                    return;
                }
                this.initializationVector = encPieces[0];
                this.cipherText = encPieces[1];
                break;
            case EncryptionType.Rsa2048_OaepSha256_B64:
            case EncryptionType.Rsa2048_OaepSha1_B64:
                if (encPieces.length !== 1) {
                    return;
                }
                this.cipherText = encPieces[0];
                break;
            default:
                return;
        }
    }
    decrypt(orgId) {
        if (this.decryptedValue) {
            return Promise.resolve(this.decryptedValue);
        }
        let cryptoService;
        const containerService = window.bitwardenContainerService;
        if (containerService) {
            cryptoService = containerService.getCryptoService();
        }
        else {
            throw new Error('window.bitwardenContainerService not initialized.');
        }
        return cryptoService.getOrgKey(orgId).then((orgKey) => {
            return cryptoService.decrypt(this, orgKey);
        }).then((decValue) => {
            this.decryptedValue = decValue;
            return this.decryptedValue;
        }).catch(() => {
            this.decryptedValue = '[error: cannot decrypt]';
            return this.decryptedValue;
        });
    }
}
export { CipherString };
window.CipherString = CipherString;
//# sourceMappingURL=cipherString.js.map