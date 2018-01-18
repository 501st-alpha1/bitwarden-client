var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FolderData } from '../models/data/folderData';
import { Folder } from '../models/domain/folder';
import { FolderRequest } from '../models/request/folderRequest';
const Keys = {
    foldersPrefix: 'folders_',
};
export class FolderService {
    constructor(cryptoService, userService, noneFolder, apiService, storageService) {
        this.cryptoService = cryptoService;
        this.userService = userService;
        this.noneFolder = noneFolder;
        this.apiService = apiService;
        this.storageService = storageService;
    }
    clearCache() {
        this.decryptedFolderCache = null;
    }
    encrypt(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = new Folder();
            folder.id = model.id;
            folder.name = yield this.cryptoService.encrypt(model.name);
            return folder;
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            if (folders == null || !folders.hasOwnProperty(id)) {
                return null;
            }
            return new Folder(folders[id]);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            const response = [];
            for (const id in folders) {
                if (folders.hasOwnProperty(id)) {
                    response.push(new Folder(folders[id]));
                }
            }
            return response;
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.decryptedFolderCache != null) {
                return this.decryptedFolderCache;
            }
            const decFolders = [{
                    id: null,
                    name: this.noneFolder(),
                }];
            const key = yield this.cryptoService.getKey();
            if (key == null) {
                throw new Error('No key.');
            }
            const promises = [];
            const folders = yield this.getAll();
            folders.forEach((folder) => {
                promises.push(folder.decrypt().then((f) => {
                    decFolders.push(f);
                }));
            });
            yield Promise.all(promises);
            this.decryptedFolderCache = decFolders;
            return this.decryptedFolderCache;
        });
    }
    saveWithServer(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new FolderRequest(folder);
            let response;
            if (folder.id == null) {
                response = yield this.apiService.postFolder(request);
                folder.id = response.id;
            }
            else {
                response = yield this.apiService.putFolder(folder.id, request);
            }
            const userId = yield this.userService.getUserId();
            const data = new FolderData(response, userId);
            yield this.upsert(data);
        });
    }
    upsert(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            if (folders == null) {
                folders = {};
            }
            if (folder instanceof FolderData) {
                const f = folder;
                folders[f.id] = f;
            }
            else {
                folder.forEach((f) => {
                    folders[f.id] = f;
                });
            }
            yield this.storageService.save(Keys.foldersPrefix + userId, folders);
            this.decryptedFolderCache = null;
        });
    }
    replace(folders) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            yield this.storageService.save(Keys.foldersPrefix + userId, folders);
            this.decryptedFolderCache = null;
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.foldersPrefix + userId);
            this.decryptedFolderCache = null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            const folders = yield this.storageService.get(Keys.foldersPrefix + userId);
            if (folders == null) {
                return;
            }
            if (typeof id === 'string') {
                const i = id;
                delete folders[id];
            }
            else {
                id.forEach((i) => {
                    delete folders[i];
                });
            }
            yield this.storageService.save(Keys.foldersPrefix + userId, folders);
            this.decryptedFolderCache = null;
        });
    }
    deleteWithServer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiService.deleteFolder(id);
            yield this.delete(id);
        });
    }
}
//# sourceMappingURL=folder.service.js.map