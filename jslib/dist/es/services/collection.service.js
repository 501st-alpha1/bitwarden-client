var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CollectionData } from '../models/data/collectionData';
import { Collection } from '../models/domain/collection';
const Keys = {
    collectionsPrefix: 'collections_',
};
export class CollectionService {
    constructor(cryptoService, userService, storageService) {
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.storageService = storageService;
    }
    clearCache() {
        this.decryptedCollectionCache = null;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            if (collections == null || !collections.hasOwnProperty(id)) {
                return null;
            }
            return new Collection(collections[id]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            const response = [];
            for (const id in collections) {
                if (collections.hasOwnProperty(id)) {
                    response.push(new Collection(collections[id]));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedCollectionCache != null) {
                return this.decryptedCollectionCache;
            }
            const key = yield this.cryptoService.getKey();
            if (key == null) {
                throw new Error('No key.');
            }
            const decFolders = [];
            const promises = [];
            const folders = yield this.getAll();
            folders.forEach((folder) => {
                promises.push(folder.decrypt().then((f) => {
                    decFolders.push(f);
                }));
            });
            yield Promise.all(promises);
            this.decryptedCollectionCache = decFolders;
            return this.decryptedCollectionCache;
        });
    }
    upsert(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            if (collections == null) {
                collections = {};
            }
            if (collection instanceof CollectionData) {
                const c = collection;
                collections[c.id] = c;
            }
            else {
                collection.forEach((c) => {
                    collections[c.id] = c;
                });
            }
            yield this.storageService.save(Keys.collectionsPrefix + userId, collections);
            this.decryptedCollectionCache = null;
        });
    }
    replace(collections) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.collectionsPrefix + userId, collections);
            this.decryptedCollectionCache = null;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.collectionsPrefix + userId);
            this.decryptedCollectionCache = null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const collections = yield this.storageService.get(Keys.collectionsPrefix + userId);
            if (collections == null) {
                return;
            }
            if (typeof id === 'string') {
                const i = id;
                delete collections[id];
            }
            else {
                id.forEach((i) => {
                    delete collections[i];
                });
            }
            yield this.storageService.save(Keys.collectionsPrefix + userId, collections);
            this.decryptedCollectionCache = null;
        });
    }
}
//# sourceMappingURL=collection.service.js.map