var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EnvironmentUrls } from '../models/domain/environmentUrls';
import { ConstantsService } from './constants.service';
export class EnvironmentService {
    constructor(apiService, storageService) {
        this.apiService = apiService;
        this.storageService = storageService;
    }
    setUrlsFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlsObj = yield this.storageService.get(ConstantsService.environmentUrlsKey);
            const urls = urlsObj || {
                base: null,
                api: null,
                identity: null,
                icons: null,
                webVault: null,
            };
            const envUrls = new EnvironmentUrls();
            if (urls.base) {
                this.baseUrl = envUrls.base = urls.base;
                yield this.apiService.setUrls(envUrls);
                return;
            }
            this.webVaultUrl = urls.webVault;
            this.apiUrl = envUrls.api = urls.api;
            this.identityUrl = envUrls.identity = urls.identity;
            this.iconsUrl = urls.icons;
            yield this.apiService.setUrls(envUrls);
        });
    }
    setUrls(urls) {
        return __awaiter(this, void 0, void 0, function* () {
            urls.base = this.formatUrl(urls.base);
            urls.webVault = this.formatUrl(urls.webVault);
            urls.api = this.formatUrl(urls.api);
            urls.identity = this.formatUrl(urls.identity);
            urls.icons = this.formatUrl(urls.icons);
            yield this.storageService.save(ConstantsService.environmentUrlsKey, {
                base: urls.base,
                api: urls.api,
                identity: urls.identity,
                webVault: urls.webVault,
                icons: urls.icons,
            });
            this.baseUrl = urls.base;
            this.webVaultUrl = urls.webVault;
            this.apiUrl = urls.api;
            this.identityUrl = urls.identity;
            this.iconsUrl = urls.icons;
            const envUrls = new EnvironmentUrls();
            if (this.baseUrl) {
                envUrls.base = this.baseUrl;
            }
            else {
                envUrls.api = this.apiUrl;
                envUrls.identity = this.identityUrl;
            }
            yield this.apiService.setUrls(envUrls);
            return urls;
        });
    }
    formatUrl(url) {
        if (url == null || url === '') {
            return null;
        }
        url = url.replace(/\/+$/g, '');
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }
}
//# sourceMappingURL=environment.service.js.map