var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CipherData } from '../models/data/cipherData';
import { CollectionData } from '../models/data/collectionData';
import { FolderData } from '../models/data/folderData';
const Keys = {
    lastSyncPrefix: 'lastSync_',
};
export class SyncService {
    constructor(userService, apiService, settingsService, folderService, cipherService, cryptoService, collectionService, storageService, messagingService, logoutCallback) {
        this.userService = userService;
        this.apiService = apiService;
        this.settingsService = settingsService;
        this.folderService = folderService;
        this.cipherService = cipherService;
        this.cryptoService = cryptoService;
        this.collectionService = collectionService;
        this.storageService = storageService;
        this.messagingService = messagingService;
        this.logoutCallback = logoutCallback;
        this.syncInProgress = false;
    }
    getLastSync() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const lastSync = yield this.storageService.get(Keys.lastSyncPrefix + userId);
            if (lastSync) {
                return new Date(lastSync);
            }
            return null;
        });
    }
    setLastSync(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.lastSyncPrefix + userId, date.toJSON());
        });
    }
    syncStarted() {
        this.syncInProgress = true;
        this.messagingService.send('syncStarted');
    }
    syncCompleted(successfully) {
        this.syncInProgress = false;
        this.messagingService.send('syncCompleted', { successfully: successfully });
    }
    fullSync(forceSync) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStarted();
            const isAuthenticated = yield this.userService.isAuthenticated();
            if (!isAuthenticated) {
                this.syncCompleted(false);
                return false;
            }
            const now = new Date();
            const needsSyncResult = yield this.needsSyncing(forceSync);
            const needsSync = needsSyncResult[0];
            const skipped = needsSyncResult[1];
            if (skipped) {
                this.syncCompleted(false);
                return false;
            }
            if (!needsSync) {
                yield this.setLastSync(now);
                this.syncCompleted(false);
                return false;
            }
            const userId = yield this.userService.getUserId();
            try {
                const response = yield this.apiService.getSync();
                yield this.syncProfile(response.profile);
                yield this.syncFolders(userId, response.folders);
                yield this.syncCollections(response.collections);
                yield this.syncCiphers(userId, response.ciphers);
                yield this.syncSettings(userId, response.domains);
                yield this.setLastSync(now);
                this.syncCompleted(true);
                return true;
            }
            catch (e) {
                this.syncCompleted(false);
                return false;
            }
        });
    }
    // Helpers
    needsSyncing(forceSync) {
        return __awaiter(this, void 0, void 0, function* () {
            if (forceSync) {
                return [true, false];
            }
            try {
                const response = yield this.apiService.getAccountRevisionDate();
                const accountRevisionDate = new Date(response);
                const lastSync = yield this.getLastSync();
                if (lastSync != null && accountRevisionDate <= lastSync) {
                    return [false, false];
                }
                return [true, false];
            }
            catch (e) {
                return [false, true];
            }
        });
    }
    syncProfile(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const stamp = yield this.userService.getSecurityStamp();
            if (stamp != null && stamp !== response.securityStamp) {
                if (this.logoutCallback != null) {
                    this.logoutCallback(true);
                }
                throw new Error('Stamp has changed');
            }
            yield this.cryptoService.setEncKey(response.key);
            yield this.cryptoService.setEncPrivateKey(response.privateKey);
            yield this.cryptoService.setOrgKeys(response.organizations);
            yield this.userService.setSecurityStamp(response.securityStamp);
        });
    }
    syncFolders(userId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = {};
            response.forEach((f) => {
                folders[f.id] = new FolderData(f, userId);
            });
            return yield this.folderService.replace(folders);
        });
    }
    syncCollections(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = {};
            response.forEach((c) => {
                collections[c.id] = new CollectionData(c);
            });
            return yield this.collectionService.replace(collections);
        });
    }
    syncCiphers(userId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const ciphers = {};
            response.forEach((c) => {
                ciphers[c.id] = new CipherData(c, userId);
            });
            return yield this.cipherService.replace(ciphers);
        });
    }
    syncSettings(userId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let eqDomains = [];
            if (response != null && response.equivalentDomains != null) {
                eqDomains = eqDomains.concat(response.equivalentDomains);
            }
            if (response != null && response.globalEquivalentDomains != null) {
                response.globalEquivalentDomains.forEach((global) => {
                    if (global.domains.length > 0) {
                        eqDomains.push(global.domains);
                    }
                });
            }
            return this.settingsService.setEquivalentDomains(eqDomains);
        });
    }
}
//# sourceMappingURL=sync.service.js.map