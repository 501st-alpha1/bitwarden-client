var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Keys = {
    settingsPrefix: 'settings_',
    equivalentDomains: 'equivalentDomains',
};
export class SettingsService {
    constructor(userService, storageService) {
        this.userService = userService;
        this.storageService = storageService;
    }
    clearCache() {
        this.settingsCache = null;
    }
    getEquivalentDomains() {
        return this.getSettingsKey(Keys.equivalentDomains);
    }
    setEquivalentDomains(equivalentDomains) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setSettingsKey(Keys.equivalentDomains, equivalentDomains);
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.remove(Keys.settingsPrefix + userId);
            this.settingsCache = null;
        });
    }
    // Helpers
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settingsCache == null) {
                const userId = yield this.userService.getUserId();
                this.settingsCache = this.storageService.get(Keys.settingsPrefix + userId);
            }
            return this.settingsCache;
        });
    }
    getSettingsKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.getSettings();
            if (settings != null && settings[key]) {
                return settings[key];
            }
            return null;
        });
    }
    setSettingsKey(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userService.getUserId();
            let settings = yield this.getSettings();
            if (!settings) {
                settings = {};
            }
            settings[key] = value;
            yield this.storageService.save(Keys.settingsPrefix + userId, settings);
            this.settingsCache = settings;
        });
    }
}
//# sourceMappingURL=settings.service.js.map