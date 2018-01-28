var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as forge from 'node-forge';
import { EncryptionType } from '../enums/encryptionType';
import { CipherString } from '../models/domain/cipherString';
import { EncryptedObject } from '../models/domain/encryptedObject';
import { SymmetricCryptoKey } from '../models/domain/symmetricCryptoKey';
import { ConstantsService } from './constants.service';
import { UtilsService } from './utils.service';
const Keys = {
    key: 'key',
    encOrgKeys: 'encOrgKeys',
    encPrivateKey: 'encPrivateKey',
    encKey: 'encKey',
    keyHash: 'keyHash',
};
const SigningAlgorithm = {
    name: 'HMAC',
    hash: { name: 'SHA-256' },
};
const AesAlgorithm = {
    name: 'AES-CBC',
};
const Crypto = window.crypto;
const Subtle = Crypto.subtle;
export class CryptoService {
    constructor(storageService, secureStorageService) {
        this.storageService = storageService;
        this.secureStorageService = secureStorageService;
    }
    setKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.key = key;
            const option = yield this.storageService.get(ConstantsService.lockOptionKey);
            if (option != null) {
                // if we have a lock option set, we do not store the key
                return;
            }
            return this.secureStorageService.save(Keys.key, key.keyB64);
        });
    }
    setKeyHash(keyHash) {
        this.keyHash = keyHash;
        return this.storageService.save(Keys.keyHash, keyHash);
    }
    setEncKey(encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encKey == null) {
                return;
            }
            yield this.storageService.save(Keys.encKey, encKey);
            this.encKey = null;
        });
    }
    setEncPrivateKey(encPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (encPrivateKey == null) {
                return;
            }
            yield this.storageService.save(Keys.encPrivateKey, encPrivateKey);
            this.privateKey = null;
        });
    }
    setOrgKeys(orgs) {
        const orgKeys = {};
        orgs.forEach((org) => {
            orgKeys[org.id] = org.key;
        });
        return this.storageService.save(Keys.encOrgKeys, orgKeys);
    }
    getKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.key != null) {
                return this.key;
            }
            const option = yield this.storageService.get(ConstantsService.lockOptionKey);
            if (option != null) {
                return null;
            }
            const key = yield this.secureStorageService.get(Keys.key);
            if (key) {
                this.key = new SymmetricCryptoKey(key, true);
            }
            return key == null ? null : this.key;
        });
    }
    getKeyHash() {
        if (this.keyHash != null) {
            return Promise.resolve(this.keyHash);
        }
        return this.storageService.get(Keys.keyHash);
    }
    getEncKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.encKey != null) {
                return this.encKey;
            }
            const encKey = yield this.storageService.get(Keys.encKey);
            if (encKey == null) {
                return null;
            }
            const key = yield this.getKey();
            if (key == null) {
                return null;
            }
            const decEncKey = yield this.decrypt(new CipherString(encKey), key, 'raw');
            if (decEncKey == null) {
                return null;
            }
            this.encKey = new SymmetricCryptoKey(decEncKey);
            return this.encKey;
        });
    }
    getPrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.privateKey != null) {
                return this.privateKey;
            }
            const encPrivateKey = yield this.storageService.get(Keys.encPrivateKey);
            if (encPrivateKey == null) {
                return null;
            }
            const privateKey = yield this.decrypt(new CipherString(encPrivateKey), null, 'raw');
            const privateKeyB64 = forge.util.encode64(privateKey);
            this.privateKey = UtilsService.fromB64ToArray(privateKeyB64).buffer;
            return this.privateKey;
        });
    }
    getOrgKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.orgKeys != null && this.orgKeys.size > 0) {
                return this.orgKeys;
            }
            const encOrgKeys = yield this.storageService.get(Keys.encOrgKeys);
            if (!encOrgKeys) {
                return null;
            }
            const orgKeys = new Map();
            let setKey = false;
            for (const orgId in encOrgKeys) {
                if (!encOrgKeys.hasOwnProperty(orgId)) {
                    continue;
                }
                const decValueB64 = yield this.rsaDecrypt(encOrgKeys[orgId]);
                orgKeys.set(orgId, new SymmetricCryptoKey(decValueB64, true));
                setKey = true;
            }
            if (setKey) {
                this.orgKeys = orgKeys;
            }
            return this.orgKeys;
        });
    }
    getOrgKey(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orgId == null) {
                return null;
            }
            const orgKeys = yield this.getOrgKeys();
            if (orgKeys == null || !orgKeys.has(orgId)) {
                return null;
            }
            return orgKeys.get(orgId);
        });
    }
    clearKey() {
        this.key = this.legacyEtmKey = null;
        return this.secureStorageService.remove(Keys.key);
    }
    clearKeyHash() {
        this.keyHash = null;
        return this.storageService.remove(Keys.keyHash);
    }
    clearEncKey(memoryOnly) {
        this.encKey = null;
        if (memoryOnly) {
            return Promise.resolve();
        }
        return this.storageService.remove(Keys.encKey);
    }
    clearPrivateKey(memoryOnly) {
        this.privateKey = null;
        if (memoryOnly) {
            return Promise.resolve();
        }
        return this.storageService.remove(Keys.encPrivateKey);
    }
    clearOrgKeys(memoryOnly) {
        this.orgKeys = null;
        if (memoryOnly) {
            return Promise.resolve();
        }
        return this.storageService.remove(Keys.encOrgKeys);
    }
    clearKeys() {
        return Promise.all([
            this.clearKey(),
            this.clearKeyHash(),
            this.clearOrgKeys(),
            this.clearEncKey(),
            this.clearPrivateKey(),
        ]);
    }
    toggleKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getKey();
            const option = yield this.storageService.get(ConstantsService.lockOptionKey);
            if (option != null || option === 0) {
                // if we have a lock option set, clear the key
                yield this.clearKey();
                this.key = key;
                return;
            }
            yield this.setKey(key);
        });
    }
    makeKey(password, salt) {
        const keyBytes = forge.pbkdf2(forge.util.encodeUtf8(password), forge.util.encodeUtf8(salt), 5000, 256 / 8, 'sha256');
        return new SymmetricCryptoKey(keyBytes);
    }
    hashPassword(password, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedKey = yield this.getKey();
            key = key || storedKey;
            if (!password || !key) {
                throw new Error('Invalid parameters.');
            }
            const hashBits = forge.pbkdf2(key.key, forge.util.encodeUtf8(password), 1, 256 / 8, 'sha256');
            return forge.util.encode64(hashBits);
        });
    }
    makeEncKey(key) {
        const bytes = new Uint8Array(512 / 8);
        Crypto.getRandomValues(bytes);
        return this.encrypt(bytes, key, 'raw');
    }
    encrypt(plainValue, key, plainValueEncoding = 'utf8') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!plainValue) {
                return Promise.resolve(null);
            }
            let plainValueArr;
            if (plainValueEncoding === 'utf8') {
                plainValueArr = UtilsService.fromUtf8ToArray(plainValue);
            }
            else {
                plainValueArr = plainValue;
            }
            const encValue = yield this.aesEncrypt(plainValueArr.buffer, key);
            const iv = UtilsService.fromBufferToB64(encValue.iv.buffer);
            const ct = UtilsService.fromBufferToB64(encValue.ct.buffer);
            const mac = encValue.mac ? UtilsService.fromBufferToB64(encValue.mac.buffer) : null;
            return new CipherString(encValue.key.encType, iv, ct, mac);
        });
    }
    encryptToBytes(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const encValue = yield this.aesEncrypt(plainValue, key);
            let macLen = 0;
            if (encValue.mac) {
                macLen = encValue.mac.length;
            }
            const encBytes = new Uint8Array(1 + encValue.iv.length + macLen + encValue.ct.length);
            encBytes.set([encValue.key.encType]);
            encBytes.set(encValue.iv, 1);
            if (encValue.mac) {
                encBytes.set(encValue.mac, 1 + encValue.iv.length);
            }
            encBytes.set(encValue.ct, 1 + encValue.iv.length + macLen);
            return encBytes.buffer;
        });
    }
    decrypt(cipherString, key, outputEncoding = 'utf8') {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('key inside decript', key)
            const ivBytes = forge.util.decode64(cipherString.initializationVector);
            const ctBytes = forge.util.decode64(cipherString.cipherText);
            const macBytes = cipherString.mac ? forge.util.decode64(cipherString.mac) : null;
            const decipher = yield this.aesDecrypt(cipherString.encryptionType, ctBytes, ivBytes, macBytes, key);
            if (!decipher) {
                return null;
            }
            if (outputEncoding === 'utf8') {
                return decipher.output.toString('utf8');
            }
            else {
                return decipher.output.getBytes();
            }
        });
    }
    decryptFromBytes(encBuf, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!encBuf) {
                throw new Error('no encBuf.');
            }
            const encBytes = new Uint8Array(encBuf);
            const encType = encBytes[0];
            let ctBytes = null;
            let ivBytes = null;
            let macBytes = null;
            switch (encType) {
                case EncryptionType.AesCbc128_HmacSha256_B64:
                case EncryptionType.AesCbc256_HmacSha256_B64:
                    if (encBytes.length <= 49) {
                        return null;
                    }
                    ivBytes = encBytes.slice(1, 17);
                    macBytes = encBytes.slice(17, 49);
                    ctBytes = encBytes.slice(49);
                    break;
                case EncryptionType.AesCbc256_B64:
                    if (encBytes.length <= 17) {
                        return null;
                    }
                    ivBytes = encBytes.slice(1, 17);
                    ctBytes = encBytes.slice(17);
                    break;
                default:
                    return null;
            }
            return yield this.aesDecryptWC(encType, ctBytes.buffer, ivBytes.buffer, macBytes ? macBytes.buffer : null, key);
        });
    }
    rsaDecrypt(encValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const headerPieces = encValue.split('.');
            let encType = null;
            let encPieces;
            if (headerPieces.length === 1) {
                encType = EncryptionType.Rsa2048_OaepSha256_B64;
                encPieces = [headerPieces[0]];
            }
            else if (headerPieces.length === 2) {
                try {
                    encType = parseInt(headerPieces[0], null);
                    encPieces = headerPieces[1].split('|');
                }
                catch (e) { }
            }
            switch (encType) {
                case EncryptionType.Rsa2048_OaepSha256_B64:
                case EncryptionType.Rsa2048_OaepSha1_B64:
                    if (encPieces.length !== 1) {
                        throw new Error('Invalid cipher format.');
                    }
                    break;
                case EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
                case EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    if (encPieces.length !== 2) {
                        throw new Error('Invalid cipher format.');
                    }
                    break;
                default:
                    throw new Error('encType unavailable.');
            }
            if (encPieces == null || encPieces.length <= 0) {
                throw new Error('encPieces unavailable.');
            }
            const key = yield this.getEncKey();
            if (key != null && key.macKey != null && encPieces.length > 1) {
                const ctBytes = forge.util.decode64(encPieces[0]);
                const macBytes = forge.util.decode64(encPieces[1]);
                const computedMacBytes = yield this.computeMac(ctBytes, key.macKey, false);
                const macsEqual = yield this.macsEqual(key.macKey, macBytes, computedMacBytes);
                if (!macsEqual) {
                    throw new Error('MAC failed.');
                }
            }
            const privateKeyBytes = yield this.getPrivateKey();
            if (!privateKeyBytes) {
                throw new Error('No private key.');
            }
            let rsaAlgorithm = null;
            switch (encType) {
                case EncryptionType.Rsa2048_OaepSha256_B64:
                case EncryptionType.Rsa2048_OaepSha256_HmacSha256_B64:
                    rsaAlgorithm = {
                        name: 'RSA-OAEP',
                        hash: { name: 'SHA-256' },
                    };
                    break;
                case EncryptionType.Rsa2048_OaepSha1_B64:
                case EncryptionType.Rsa2048_OaepSha1_HmacSha256_B64:
                    rsaAlgorithm = {
                        name: 'RSA-OAEP',
                        hash: { name: 'SHA-1' },
                    };
                    break;
                default:
                    throw new Error('encType unavailable.');
            }
            const privateKey = yield Subtle.importKey('pkcs8', privateKeyBytes, rsaAlgorithm, false, ['decrypt']);
            const ctArr = UtilsService.fromB64ToArray(encPieces[0]);
            const decBytes = yield Subtle.decrypt(rsaAlgorithm, privateKey, ctArr.buffer);
            const b64DecValue = UtilsService.fromBufferToB64(decBytes);
            return b64DecValue;
        });
    }
    // Helpers
    aesEncrypt(plainValue, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = new EncryptedObject();
            obj.key = yield this.getKeyForEncryption(key);
            const keyBuf = obj.key.getBuffers();
            obj.iv = new Uint8Array(16);
            Crypto.getRandomValues(obj.iv);
            const encKey = yield Subtle.importKey('raw', keyBuf.encKey, AesAlgorithm, false, ['encrypt']);
            const encValue = yield Subtle.encrypt({ name: 'AES-CBC', iv: obj.iv }, encKey, plainValue);
            obj.ct = new Uint8Array(encValue);
            if (keyBuf.macKey) {
                const data = new Uint8Array(obj.iv.length + obj.ct.length);
                data.set(obj.iv, 0);
                data.set(obj.ct, obj.iv.length);
                const mac = yield this.computeMacWC(data.buffer, keyBuf.macKey);
                obj.mac = new Uint8Array(mac);
            }
            return obj;
        });
    }
    aesDecrypt(encType, ctBytes, ivBytes, macBytes, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyForEnc = yield this.getKeyForEncryption(key);
            console.log('keyForEnc', keyForEnc)
            const theKey = this.resolveLegacyKey(encType, keyForEnc);
            console.log('encType', encType)
            console.log('theKey.encType', theKey.encType)
            console.log('theKey', theKey)
            if (encType !== theKey.encType) {
                // tslint:disable-next-line
                console.error('encType unavailable.');
                return null;
            }
            if (theKey.macKey != null && macBytes != null) {
                const computedMacBytes = this.computeMac(ivBytes + ctBytes, theKey.macKey, false);
                if (!this.macsEqual(theKey.macKey, computedMacBytes, macBytes)) {
                    // tslint:disable-next-line
                    console.error('MAC failed.');
                    return null;
                }
            }
            const ctBuffer = forge.util.createBuffer(ctBytes);
            const decipher = forge.cipher.createDecipher('AES-CBC', theKey.encKey);
            decipher.start({ iv: ivBytes });
            decipher.update(ctBuffer);
            decipher.finish();
            return decipher;
        });
    }
    aesDecryptWC(encType, ctBuf, ivBuf, macBuf, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const theKey = yield this.getKeyForEncryption(key);
            const keyBuf = theKey.getBuffers();
            const encKey = yield Subtle.importKey('raw', keyBuf.encKey, AesAlgorithm, false, ['decrypt']);
            if (!keyBuf.macKey || !macBuf) {
                return null;
            }
            const data = new Uint8Array(ivBuf.byteLength + ctBuf.byteLength);
            data.set(new Uint8Array(ivBuf), 0);
            data.set(new Uint8Array(ctBuf), ivBuf.byteLength);
            const computedMacBuf = yield this.computeMacWC(data.buffer, keyBuf.macKey);
            if (computedMacBuf === null) {
                return null;
            }
            const macsMatch = yield this.macsEqualWC(keyBuf.macKey, macBuf, computedMacBuf);
            if (macsMatch === false) {
                // tslint:disable-next-line
                console.error('MAC failed.');
                return null;
            }
            return yield Subtle.decrypt({ name: 'AES-CBC', iv: ivBuf }, encKey, ctBuf);
        });
    }
    computeMac(dataBytes, macKey, b64Output) {
        const hmac = forge.hmac.create();
        hmac.start('sha256', macKey);
        hmac.update(dataBytes);
        const mac = hmac.digest();
        return b64Output ? forge.util.encode64(mac.getBytes()) : mac.getBytes();
    }
    computeMacWC(dataBuf, macKeyBuf) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield Subtle.importKey('raw', macKeyBuf, SigningAlgorithm, false, ['sign']);
            return yield Subtle.sign(SigningAlgorithm, key, dataBuf);
        });
    }
    // Safely compare two MACs in a way that protects against timing attacks (Double HMAC Verification).
    // ref: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/
    macsEqual(macKey, mac1, mac2) {
        const hmac = forge.hmac.create();
        hmac.start('sha256', macKey);
        hmac.update(mac1);
        const mac1Bytes = hmac.digest().getBytes();
        hmac.start(null, null);
        hmac.update(mac2);
        const mac2Bytes = hmac.digest().getBytes();
        return mac1Bytes === mac2Bytes;
    }
    macsEqualWC(macKeyBuf, mac1Buf, mac2Buf) {
        return __awaiter(this, void 0, void 0, function* () {
            const macKey = yield Subtle.importKey('raw', macKeyBuf, SigningAlgorithm, false, ['sign']);
            const mac1 = yield Subtle.sign(SigningAlgorithm, macKey, mac1Buf);
            const mac2 = yield Subtle.sign(SigningAlgorithm, macKey, mac2Buf);
            if (mac1.byteLength !== mac2.byteLength) {
                return false;
            }
            const arr1 = new Uint8Array(mac1);
            const arr2 = new Uint8Array(mac2);
            for (let i = 0; i < arr2.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        });
    }
    getKeyForEncryption(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key) {
                return key;
            }
            const encKey = yield this.getEncKey();
            return encKey || (yield this.getKey());
        });
    }
    resolveLegacyKey(encType, key) {
        console.log('encType inside resolve legacy key', encType)
        console.log('encType inside resolve legacy key', key)
        if (encType === EncryptionType.AesCbc128_HmacSha256_B64 &&
            key.encType === EncryptionType.AesCbc256_B64) {
            // Old encrypt-then-mac scheme, make a new key
            console.log('Old encrypt-then-mac scheme, make a new key')
            this.legacyEtmKey = this.legacyEtmKey ||
                new SymmetricCryptoKey(key.key, false, EncryptionType.AesCbc128_HmacSha256_B64);
            console.log(this.legacyEtmKey)
            return this.legacyEtmKey;
        }
        return key;
    }
}
//# sourceMappingURL=crypto.service.js.map