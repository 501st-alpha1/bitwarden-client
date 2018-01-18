var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ConstantsService } from './constants.service';
export class LockService {
    constructor(cipherService, folderService, collectionService, cryptoService, platformUtilsService, storageService, setIcon, refreshBadgeAndMenu) {
        this.cipherService = cipherService;
        this.folderService = folderService;
        this.collectionService = collectionService;
        this.cryptoService = cryptoService;
        this.platformUtilsService = platformUtilsService;
        this.storageService = storageService;
        this.setIcon = setIcon;
        this.refreshBadgeAndMenu = refreshBadgeAndMenu;
        this.checkLock();
        setInterval(() => this.checkLock(), 10 * 1000); // check every 10 seconds
    }
    checkLock() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.platformUtilsService.isViewOpen()) {
                // Do not lock
                return;
            }
            const key = yield this.cryptoService.getKey();
            if (key == null) {
                // no key so no need to lock
                return;
            }
            const lockOption = yield this.storageService.get(ConstantsService.lockOptionKey);
            if (lockOption == null || lockOption < 0) {
                return;
            }
            const lastActive = yield this.storageService.get(ConstantsService.lastActiveKey);
            if (lastActive == null) {
                return;
            }
            const lockOptionSeconds = lockOption * 60;
            const diffSeconds = ((new Date()).getTime() - lastActive) / 1000;
            if (diffSeconds >= lockOptionSeconds) {
                // need to lock now
                yield this.lock();
            }
        });
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.cryptoService.clearKey(),
                this.cryptoService.clearOrgKeys(true),
                this.cryptoService.clearPrivateKey(true),
                this.cryptoService.clearEncKey(true),
                this.setIcon(),
                this.refreshBadgeAndMenu(),
            ]);
            this.folderService.clearCache();
            this.cipherService.clearCache();
            this.collectionService.clearCache();
        });
    }
}
//# sourceMappingURL=lock.service.js.map