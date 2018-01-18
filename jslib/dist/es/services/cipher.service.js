var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CipherType } from '../enums/cipherType';
import { CipherData } from '../models/data/cipherData';
import { Cipher } from '../models/domain/cipher';
import { Field } from '../models/domain/field';
import { CipherRequest } from '../models/request/cipherRequest';
const Keys = {
    ciphersPrefix: 'ciphers_',
    localData: 'sitesLocalData',
    neverDomains: 'neverDomains',
};
export class CipherService {
    constructor(cryptoService, userService, settingsService, apiService, storageService) {
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.settingsService = settingsService;
        this.apiService = apiService;
        this.storageService = storageService;
    }
    static sortCiphersByLastUsed(a, b) {
        const aLastUsed = a.localData && a.localData.lastUsedDate ? a.localData.lastUsedDate : null;
        const bLastUsed = b.localData && b.localData.lastUsedDate ? b.localData.lastUsedDate : null;
        if (aLastUsed != null && bLastUsed != null && aLastUsed < bLastUsed) {
            return 1;
        }
        if (aLastUsed != null && bLastUsed == null) {
            return -1;
        }
        if (bLastUsed != null && aLastUsed != null && aLastUsed > bLastUsed) {
            return -1;
        }
        if (bLastUsed != null && aLastUsed == null) {
            return 1;
        }
        return 0;
    }
    static sortCiphersByLastUsedThenName(a, b) {
        const result = CipherService.sortCiphersByLastUsed(a, b);
        if (result !== 0) {
            return result;
        }
        const nameA = (a.name + '_' + a.username).toUpperCase();
        const nameB = (b.name + '_' + b.username).toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }
    clearCache() {
        this.decryptedCipherCache = null;
    }
    encrypt(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const cipher = new Cipher();
            cipher.id = model.id;
            cipher.folderId = model.folderId;
            cipher.favorite = model.favorite;
            cipher.organizationId = model.organizationId;
            cipher.type = model.type;
            cipher.collectionIds = model.collectionIds;
            const key = yield this.cryptoService.getOrgKey(cipher.organizationId);
            yield Promise.all([
                this.encryptObjProperty(model, cipher, {
                    name: null,
                    notes: null,
                }, key),
                this.encryptCipherData(model, cipher, key),
                this.encryptFields(model.fields, key).then((fields) => {
                    cipher.fields = fields;
                }),
            ]);
            return cipher;
        });
    }
    encryptFields(fieldsModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fieldsModel || !fieldsModel.length) {
                return null;
            }
            const self = this;
            const encFields = [];
            yield fieldsModel.reduce((promise, field) => {
                return promise.then(() => {
                    return self.encryptField(field, key);
                }).then((encField) => {
                    encFields.push(encField);
                });
            }, Promise.resolve());
            return encFields;
        });
    }
    encryptField(fieldModel, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = new Field();
            field.type = fieldModel.type;
            yield this.encryptObjProperty(fieldModel, field, {
                name: null,
                value: null,
            }, key);
            return field;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const localData = yield this.storageService.get(Keys.localData);
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null || !ciphers.hasOwnProperty(id)) {
                return null;
            }
            return new Cipher(ciphers[id], false, localData ? localData[id] : null);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const localData = yield this.storageService.get(Keys.localData);
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            const response = [];
            for (const id in ciphers) {
                if (ciphers.hasOwnProperty(id)) {
                    response.push(new Cipher(ciphers[id], false, localData ? localData[id] : null));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedCipherCache != null) {
                return this.decryptedCipherCache;
            }
            const decCiphers = [];
            const key = yield this.cryptoService.getKey();
            if (key == null) {
                throw new Error('No key.');
            }
            const promises = [];
            const ciphers = yield this.getAll();
            ciphers.forEach((cipher) => {
                promises.push(cipher.decrypt().then((c) => {
                    decCiphers.push(c);
                }));
            });
            yield Promise.all(promises);
            this.decryptedCipherCache = decCiphers;
            return this.decryptedCipherCache;
        });
    }
    getAllDecryptedForGrouping(groupingId, folder = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield this.getAllDecrypted();
            const ciphersToReturn = [];
            ciphers.forEach((cipher) => {
                if (folder && cipher.folderId === groupingId) {
                    ciphersToReturn.push(cipher);
                }
                else if (!folder && cipher.collectionIds != null && cipher.collectionIds.indexOf(groupingId) > -1) {
                    ciphersToReturn.push(cipher);
                }
            });
            return ciphersToReturn;
        });
    }
    getAllDecryptedForDomain(domain, includeOtherTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (domain == null && !includeOtherTypes) {
                return Promise.resolve([]);
            }
            const eqDomainsPromise = domain == null ? Promise.resolve([]) :
                this.settingsService.getEquivalentDomains().then((eqDomains) => {
                    let matches = [];
                    eqDomains.forEach((eqDomain) => {
                        if (eqDomain.length && eqDomain.indexOf(domain) >= 0) {
                            matches = matches.concat(eqDomain);
                        }
                    });
                    if (!matches.length) {
                        matches.push(domain);
                    }
                    return matches;
                });
            const result = yield Promise.all([eqDomainsPromise, this.getAllDecrypted()]);
            const matchingDomains = result[0];
            const ciphers = result[1];
            const ciphersToReturn = [];
            ciphers.forEach((cipher) => {
                if (domain && cipher.type === CipherType.Login && cipher.login.domain &&
                    matchingDomains.indexOf(cipher.login.domain) > -1) {
                    ciphersToReturn.push(cipher);
                }
                else if (includeOtherTypes && includeOtherTypes.indexOf(cipher.type) > -1) {
                    ciphersToReturn.push(cipher);
                }
            });
            return ciphersToReturn;
        });
    }
    getLastUsedForDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = yield this.getAllDecryptedForDomain(domain);
            if (ciphers.length === 0) {
                return null;
            }
            const sortedCiphers = ciphers.sort(CipherService.sortCiphersByLastUsed);
            return sortedCiphers[0];
        });
    }
    updateLastUsedDate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ciphersLocalData = yield this.storageService.get(Keys.localData);
            if (!ciphersLocalData) {
                ciphersLocalData = {};
            }
            if (ciphersLocalData[id]) {
                ciphersLocalData[id].lastUsedDate = new Date().getTime();
            }
            else {
                ciphersLocalData[id] = {
                    lastUsedDate: new Date().getTime(),
                };
            }
            yield this.storageService.save(Keys.localData, ciphersLocalData);
            if (this.decryptedCipherCache == null) {
                return;
            }
            for (let i = 0; i < this.decryptedCipherCache.length; i++) {
                const cached = this.decryptedCipherCache[i];
                if (cached.id === id) {
                    cached.localData = ciphersLocalData[id];
                    break;
                }
            }
        });
    }
    saveNeverDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (domain == null) {
                return;
            }
            let domains = yield this.storageService.get(Keys.neverDomains);
            if (!domains) {
                domains = {};
            }
            domains[domain] = null;
            yield this.storageService.save(Keys.neverDomains, domains);
        });
    }
    saveWithServer(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new CipherRequest(cipher);
            let response;
            if (cipher.id == null) {
                response = yield this.apiService.postCipher(request);
                cipher.id = response.id;
            }
            else {
                response = yield this.apiService.putCipher(cipher.id, request);
            }
            const userId = yield this.userService.getUserId();
            const data = new CipherData(response, userId, cipher.collectionIds);
            yield this.upsert(data);
        });
    }
    saveAttachmentWithServer(cipher, unencryptedFile) {
        const self = this;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(unencryptedFile);
            reader.onload = (evt) => __awaiter(this, void 0, void 0, function* () {
                const key = yield self.cryptoService.getOrgKey(cipher.organizationId);
                const encFileName = yield self.cryptoService.encrypt(unencryptedFile.name, key);
                const encData = yield self.cryptoService.encryptToBytes(evt.target.result, key);
                const fd = new FormData();
                const blob = new Blob([encData], { type: 'application/octet-stream' });
                fd.append('data', blob, encFileName.encryptedString);
                let response;
                try {
                    response = yield self.apiService.postCipherAttachment(cipher.id, fd);
                }
                catch (e) {
                    reject(e.getSingleMessage());
                    return;
                }
                const userId = yield self.userService.getUserId();
                const data = new CipherData(response, userId, cipher.collectionIds);
                this.upsert(data);
                resolve(new Cipher(data));
            });
            reader.onerror = (evt) => {
                reject('Error reading file.');
            };
        });
    }
    upsert(cipher) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null) {
                ciphers = {};
            }
            if (cipher instanceof CipherData) {
                const c = cipher;
                ciphers[c.id] = c;
            }
            else {
                cipher.forEach((c) => {
                    ciphers[c.id] = c;
                });
            }
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    replace(ciphers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.ciphersPrefix + userId);
            this.decryptedCipherCache = null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null) {
                return;
            }
            if (typeof id === 'string') {
                const i = id;
                delete ciphers[id];
            }
            else {
                id.forEach((i) => {
                    delete ciphers[i];
                });
            }
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    deleteWithServer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.deleteCipher(id);
            yield this.delete(id);
        });
    }
    deleteAttachment(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const ciphers = yield this.storageService.get(Keys.ciphersPrefix + userId);
            if (ciphers == null || !ciphers.hasOwnProperty(id) || ciphers[id].attachments == null) {
                return;
            }
            for (let i = 0; i < ciphers[id].attachments.length; i++) {
                if (ciphers[id].attachments[i].id === attachmentId) {
                    ciphers[id].attachments.splice(i, 1);
                }
            }
            yield this.storageService.save(Keys.ciphersPrefix + userId, ciphers);
            this.decryptedCipherCache = null;
        });
    }
    deleteAttachmentWithServer(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.apiService.deleteCipherAttachment(id, attachmentId);
            }
            catch (e) {
                return Promise.reject(e.getSingleMessage());
            }
            yield this.deleteAttachment(id, attachmentId);
        });
    }
    sortCiphersByLastUsed(a, b) {
        return CipherService.sortCiphersByLastUsed(a, b);
    }
    sortCiphersByLastUsedThenName(a, b) {
        return CipherService.sortCiphersByLastUsedThenName(a, b);
    }
    // Helpers
    encryptObjProperty(model, obj, map, key) {
        const promises = [];
        const self = this;
        for (const prop in map) {
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            // tslint:disable-next-line
            (function (theProp, theObj) {
                const p = Promise.resolve().then(() => {
                    const modelProp = model[(map[theProp] || theProp)];
                    if (modelProp && modelProp !== '') {
                        return self.cryptoService.encrypt(modelProp, key);
                    }
                    return null;
                }).then((val) => {
                    theObj[theProp] = val;
                });
                promises.push(p);
            })(prop, obj);
        }
        return Promise.all(promises);
    }
    encryptCipherData(cipher, model, key) {
        switch (cipher.type) {
            case CipherType.Login:
                model.login = {};
                return this.encryptObjProperty(cipher.login, model.login, {
                    uri: null,
                    username: null,
                    password: null,
                    totp: null,
                }, key);
            case CipherType.SecureNote:
                model.secureNote = {
                    type: cipher.secureNote.type,
                };
                return Promise.resolve();
            case CipherType.Card:
                model.card = {};
                return this.encryptObjProperty(cipher.card, model.card, {
                    cardholderName: null,
                    brand: null,
                    number: null,
                    expMonth: null,
                    expYear: null,
                    code: null,
                }, key);
            case CipherType.Identity:
                model.identity = {};
                return this.encryptObjProperty(cipher.identity, model.identity, {
                    title: null,
                    firstName: null,
                    middleName: null,
                    lastName: null,
                    address1: null,
                    address2: null,
                    address3: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    country: null,
                    company: null,
                    email: null,
                    phone: null,
                    ssn: null,
                    username: null,
                    passportNumber: null,
                    licenseNumber: null,
                }, key);
            default:
                throw new Error('Unknown cipher type.');
        }
    }
}
//# sourceMappingURL=cipher.service.js.map