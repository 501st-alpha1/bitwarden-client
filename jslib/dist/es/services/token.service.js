var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UtilsService } from './utils.service';
const Keys = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    twoFactorTokenPrefix: 'twoFactorToken_',
};
export class TokenService {
    constructor(storageService) {
        this.storageService = storageService;
    }
    setTokens(accessToken, refreshToken) {
        return Promise.all([
            this.setToken(accessToken),
            this.setRefreshToken(refreshToken),
        ]);
    }
    setToken(token) {
        this.token = token;
        this.decodedToken = null;
        return this.storageService.save(Keys.accessToken, token);
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token != null) {
                return this.token;
            }
            this.token = yield this.storageService.get(Keys.accessToken);
            return this.token;
        });
    }
    setRefreshToken(refreshToken) {
        this.refreshToken = refreshToken;
        return this.storageService.save(Keys.refreshToken, refreshToken);
    }
    getRefreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.refreshToken != null) {
                return this.refreshToken;
            }
            this.refreshToken = yield this.storageService.get(Keys.refreshToken);
            return this.refreshToken;
        });
    }
    setTwoFactorToken(token, email) {
        return this.storageService.save(Keys.twoFactorTokenPrefix + email, token);
    }
    getTwoFactorToken(email) {
        return this.storageService.get(Keys.twoFactorTokenPrefix + email);
    }
    clearTwoFactorToken(email) {
        return this.storageService.remove(Keys.twoFactorTokenPrefix + email);
    }
    clearToken() {
        this.token = null;
        this.decodedToken = null;
        this.refreshToken = null;
        return Promise.all([
            this.storageService.remove(Keys.accessToken),
            this.storageService.remove(Keys.refreshToken),
        ]);
    }
    // jwthelper methods
    // ref https://github.com/auth0/angular-jwt/blob/master/src/angularJwt/services/jwt.js
    decodeToken() {
        if (this.decodedToken) {
            return this.decodedToken;
        }
        if (this.token == null) {
            throw new Error('Token not found.');
        }
        const parts = this.token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        const decoded = UtilsService.urlBase64Decode(parts[1]);
        if (decoded == null) {
            throw new Error('Cannot decode the token');
        }
        this.decodedToken = JSON.parse(decoded);
        return this.decodedToken;
    }
    getTokenExpirationDate() {
        const decoded = this.decodeToken();
        if (typeof decoded.exp === 'undefined') {
            return null;
        }
        const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds(decoded.exp);
        return d;
    }
    tokenSecondsRemaining(offsetSeconds = 0) {
        const d = this.getTokenExpirationDate();
        if (d == null) {
            return 0;
        }
        const msRemaining = d.valueOf() - (new Date().valueOf() + (offsetSeconds * 1000));
        return Math.round(msRemaining / 1000);
    }
    tokenNeedsRefresh(minutes = 5) {
        const sRemaining = this.tokenSecondsRemaining();
        return sRemaining < (60 * minutes);
    }
    getUserId() {
        const decoded = this.decodeToken();
        if (typeof decoded.sub === 'undefined') {
            throw new Error('No user id found');
        }
        return decoded.sub;
    }
    getEmail() {
        const decoded = this.decodeToken();
        if (typeof decoded.email === 'undefined') {
            throw new Error('No email found');
        }
        return decoded.email;
    }
    getName() {
        const decoded = this.decodeToken();
        if (typeof decoded.name === 'undefined') {
            throw new Error('No name found');
        }
        return decoded.name;
    }
    getPremium() {
        const decoded = this.decodeToken();
        if (typeof decoded.premium === 'undefined') {
            return false;
        }
        return decoded.premium;
    }
    getIssuer() {
        const decoded = this.decodeToken();
        if (typeof decoded.iss === 'undefined') {
            throw new Error('No issuer found');
        }
        return decoded.iss;
    }
}
//# sourceMappingURL=token.service.js.map