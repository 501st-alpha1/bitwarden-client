var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CipherResponse } from '../models/response/cipherResponse';
import { ErrorResponse } from '../models/response/errorResponse';
import { FolderResponse } from '../models/response/folderResponse';
import { IdentityTokenResponse } from '../models/response/identityTokenResponse';
import { SyncResponse } from '../models/response/syncResponse';
export class ApiService {
    constructor(tokenService, platformUtilsService, logoutCallback) {
        this.tokenService = tokenService;
        this.urlsSet = false;
        this.logoutCallback = logoutCallback;
        this.deviceType = platformUtilsService.getDevice().toString();
    }
    setUrls(urls) {
        this.urlsSet = true;
        if (urls.base != null) {
            this.baseUrl = urls.base + '/api';
            this.identityBaseUrl = urls.base + '/identity';
            return;
        }
        if (urls.api != null && urls.identity != null) {
            this.baseUrl = urls.api;
            this.identityBaseUrl = urls.identity;
            return;
        }
        /* tslint:disable */
        // Desktop
        //this.baseUrl = 'http://localhost:4000';
        //this.identityBaseUrl = 'http://localhost:33656';
        // Desktop HTTPS
        //this.baseUrl = 'https://localhost:44377';
        //this.identityBaseUrl = 'https://localhost:44392';
        // Desktop external
        //this.baseUrl = 'http://192.168.1.3:4000';
        //this.identityBaseUrl = 'http://192.168.1.3:33656';
        // Preview
        //this.baseUrl = 'https://preview-api.bitwarden.com';
        //this.identityBaseUrl = 'https://preview-identity.bitwarden.com';
        // Production
        this.baseUrl = 'https://api.bitwarden.com';
        this.identityBaseUrl = 'https://identity.bitwarden.com';
        /* tslint:enable */
    }
    // Auth APIs
    postIdentityToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(new Request(this.identityBaseUrl + '/connect/token', {
                body: this.qsStringify(request.toIdentityToken()),
                cache: 'no-cache',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': 'application/json',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            let responseJson = null;
            const typeHeader = response.headers.get('content-type');
            if (typeHeader != null && typeHeader.indexOf('application/json') > -1) {
                responseJson = yield response.json();
            }
            if (responseJson != null) {
                if (response.status === 200) {
                    return new IdentityTokenResponse(responseJson);
                }
                else if (response.status === 400 && responseJson.TwoFactorProviders2 &&
                    Object.keys(responseJson.TwoFactorProviders2).length) {
                    yield this.tokenService.clearTwoFactorToken(request.email);
                    return responseJson.TwoFactorProviders2;
                }
            }
            return Promise.reject(new ErrorResponse(responseJson, response.status, true));
        });
    }
    refreshIdentityToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doRefreshToken();
            }
            catch (e) {
                return Promise.reject(null);
            }
        });
    }
    // Two Factor APIs
    postTwoFactorEmail(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(new Request(this.baseUrl + '/two-factor/send-email-login', {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    // Account APIs
    getAccountRevisionDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/accounts/revision-date', {
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Device-Type': this.deviceType,
                }),
            }));
            if (response.status === 200) {
                return yield response.json();
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    postPasswordHint(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(new Request(this.baseUrl + '/accounts/password-hint', {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    postRegister(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(new Request(this.baseUrl + '/accounts/register', {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    // Folder APIs
    postFolder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/folders', {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                return new FolderResponse(responseJson);
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    putFolder(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/folders/' + id, {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'PUT',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                return new FolderResponse(responseJson);
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    deleteFolder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/folders/' + id, {
                cache: 'no-cache',
                headers: new Headers({
                    'Authorization': authHeader,
                    'Device-Type': this.deviceType,
                }),
                method: 'DELETE',
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    // Cipher APIs
    postCipher(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/ciphers', {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                return new CipherResponse(responseJson);
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    putCipher(id, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/ciphers/' + id, {
                body: JSON.stringify(request),
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Device-Type': this.deviceType,
                }),
                method: 'PUT',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                return new CipherResponse(responseJson);
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    deleteCipher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/ciphers/' + id, {
                cache: 'no-cache',
                headers: new Headers({
                    'Authorization': authHeader,
                    'Device-Type': this.deviceType,
                }),
                method: 'DELETE',
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    // Attachments APIs
    postCipherAttachment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/ciphers/' + id + '/attachment', {
                body: data,
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                return new CipherResponse(responseJson);
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    deleteCipherAttachment(id, attachmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/ciphers/' + id + '/attachment/' + attachmentId, {
                cache: 'no-cache',
                headers: new Headers({
                    'Authorization': authHeader,
                    'Device-Type': this.deviceType,
                }),
                method: 'DELETE',
            }));
            if (response.status !== 200) {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    // Sync APIs
    getSync() {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = yield this.handleTokenState();
            const response = yield fetch(new Request(this.baseUrl + '/sync', {
                cache: 'no-cache',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Authorization': authHeader,
                    'Device-Type': this.deviceType,
                }),
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                return new SyncResponse(responseJson);
            }
            else {
                const error = yield this.handleError(response, false);
                return Promise.reject(error);
            }
        });
    }
    // Helpers
    handleError(response, tokenError) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((tokenError && response.status === 400) || response.status === 401 || response.status === 403) {
                this.logoutCallback(true);
                return null;
            }
            let responseJson = null;
            const typeHeader = response.headers.get('content-type');
            if (typeHeader != null && typeHeader.indexOf('application/json') > -1) {
                responseJson = yield response.json();
            }
            return new ErrorResponse(responseJson, response.status, tokenError);
        });
    }
    handleTokenState() {
        return __awaiter(this, void 0, void 0, function* () {
            let accessToken;
            if (this.tokenService.tokenNeedsRefresh()) {
                const tokenResponse = yield this.doRefreshToken();
                accessToken = tokenResponse.accessToken;
            }
            else {
                accessToken = yield this.tokenService.getToken();
            }
            return 'Bearer ' + accessToken;
        });
    }
    doRefreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.tokenService.getRefreshToken();
            if (refreshToken == null || refreshToken === '') {
                throw new Error();
            }
            const response = yield fetch(new Request(this.identityBaseUrl + '/connect/token', {
                body: this.qsStringify({
                    grant_type: 'refresh_token',
                    client_id: 'browser',
                    refresh_token: refreshToken,
                }),
                cache: 'no-cache',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': 'application/json',
                    'Device-Type': this.deviceType,
                }),
                method: 'POST',
            }));
            if (response.status === 200) {
                const responseJson = yield response.json();
                const tokenResponse = new IdentityTokenResponse(responseJson);
                yield this.tokenService.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
                return tokenResponse;
            }
            else {
                const error = yield this.handleError(response, true);
                return Promise.reject(error);
            }
        });
    }
    qsStringify(params) {
        return Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }
}
//# sourceMappingURL=api.service.js.map