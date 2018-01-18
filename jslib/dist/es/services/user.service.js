var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Keys = {
    userId: 'userId',
    userEmail: 'userEmail',
    stamp: 'securityStamp',
};
export class UserService {
    constructor(tokenService, storageService) {
        this.tokenService = tokenService;
        this.storageService = storageService;
    }
    setUserIdAndEmail(userId, email) {
        this.email = email;
        this.userId = userId;
        return Promise.all([
            this.storageService.save(Keys.userEmail, email),
            this.storageService.save(Keys.userId, userId),
        ]);
    }
    setSecurityStamp(stamp) {
        this.stamp = stamp;
        return this.storageService.save(Keys.stamp, stamp);
    }
    getUserId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userId != null) {
                return this.userId;
            }
            this.userId = yield this.storageService.get(Keys.userId);
            return this.userId;
        });
    }
    getEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.email != null) {
                return this.email;
            }
            this.email = yield this.storageService.get(Keys.userEmail);
            return this.email;
        });
    }
    getSecurityStamp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.stamp != null) {
                return this.stamp;
            }
            this.stamp = yield this.storageService.get(Keys.stamp);
            return this.stamp;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.storageService.remove(Keys.userId),
                this.storageService.remove(Keys.userEmail),
                this.storageService.remove(Keys.stamp),
            ]);
            this.userId = this.email = this.stamp = null;
        });
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenService.getToken();
            if (token == null) {
                return false;
            }
            const userId = yield this.getUserId();
            return userId != null;
        });
    }
}
//# sourceMappingURL=user.service.js.map