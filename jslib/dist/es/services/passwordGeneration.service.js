var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CipherString } from '../models/domain/cipherString';
import { PasswordHistory } from '../models/domain/passwordHistory';
import { UtilsService } from './utils.service';
const DefaultOptions = {
    length: 14,
    ambiguous: false,
    number: true,
    minNumber: 1,
    uppercase: true,
    minUppercase: 1,
    lowercase: true,
    minLowercase: 1,
    special: false,
    minSpecial: 1,
};
const Keys = {
    options: 'passwordGenerationOptions',
    history: 'generatedPasswordHistory',
};
const MaxPasswordsInHistory = 100;
export class PasswordGenerationService {
    constructor(cryptoService, storageService) {
        this.cryptoService = cryptoService;
        this.storageService = storageService;
        this.history = [];
        storageService.get(Keys.history).then((encrypted) => {
            return this.decryptHistory(encrypted);
        }).then((history) => {
            this.history = history;
        });
    }
    static generatePassword(options) {
        // overload defaults with given options
        const o = Object.assign({}, DefaultOptions, options);
        // sanitize
        if (o.uppercase && o.minUppercase < 0) {
            o.minUppercase = 1;
        }
        if (o.lowercase && o.minLowercase < 0) {
            o.minLowercase = 1;
        }
        if (o.number && o.minNumber < 0) {
            o.minNumber = 1;
        }
        if (o.special && o.minSpecial < 0) {
            o.minSpecial = 1;
        }
        if (!o.length || o.length < 1) {
            o.length = 10;
        }
        const minLength = o.minUppercase + o.minLowercase + o.minNumber + o.minSpecial;
        if (o.length < minLength) {
            o.length = minLength;
        }
        const positions = [];
        if (o.lowercase && o.minLowercase > 0) {
            for (let i = 0; i < o.minLowercase; i++) {
                positions.push('l');
            }
        }
        if (o.uppercase && o.minUppercase > 0) {
            for (let i = 0; i < o.minUppercase; i++) {
                positions.push('u');
            }
        }
        if (o.number && o.minNumber > 0) {
            for (let i = 0; i < o.minNumber; i++) {
                positions.push('n');
            }
        }
        if (o.special && o.minSpecial > 0) {
            for (let i = 0; i < o.minSpecial; i++) {
                positions.push('s');
            }
        }
        while (positions.length < o.length) {
            positions.push('a');
        }
        // shuffle
        positions.sort(() => {
            return UtilsService.secureRandomNumber(0, 1) * 2 - 1;
        });
        // build out the char sets
        let allCharSet = '';
        let lowercaseCharSet = 'abcdefghijkmnopqrstuvwxyz';
        if (o.ambiguous) {
            lowercaseCharSet += 'l';
        }
        if (o.lowercase) {
            allCharSet += lowercaseCharSet;
        }
        let uppercaseCharSet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
        if (o.ambiguous) {
            uppercaseCharSet += 'O';
        }
        if (o.uppercase) {
            allCharSet += uppercaseCharSet;
        }
        let numberCharSet = '23456789';
        if (o.ambiguous) {
            numberCharSet += '01';
        }
        if (o.number) {
            allCharSet += numberCharSet;
        }
        const specialCharSet = '!@#$%^&*';
        if (o.special) {
            allCharSet += specialCharSet;
        }
        let password = '';
        for (let i = 0; i < o.length; i++) {
            let positionChars;
            switch (positions[i]) {
                case 'l':
                    positionChars = lowercaseCharSet;
                    break;
                case 'u':
                    positionChars = uppercaseCharSet;
                    break;
                case 'n':
                    positionChars = numberCharSet;
                    break;
                case 's':
                    positionChars = specialCharSet;
                    break;
                case 'a':
                    positionChars = allCharSet;
                    break;
            }
            const randomCharIndex = UtilsService.secureRandomNumber(0, positionChars.length - 1);
            password += positionChars.charAt(randomCharIndex);
        }
        return password;
    }
    generatePassword(options) {
        return PasswordGenerationService.generatePassword(options);
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.optionsCache == null) {
                const options = yield this.storageService.get(Keys.options);
                if (options == null) {
                    this.optionsCache = DefaultOptions;
                }
                else {
                    this.optionsCache = options;
                }
            }
            return this.optionsCache;
        });
    }
    saveOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storageService.save(Keys.options, options);
            this.optionsCache = options;
        });
    }
    getHistory() {
        return this.history || new Array();
    }
    addHistory(password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prevent duplicates
            if (this.matchesPrevious(password)) {
                return;
            }
            this.history.push(new PasswordHistory(password, Date.now()));
            // Remove old items.
            if (this.history.length > MaxPasswordsInHistory) {
                this.history.shift();
            }
            const newHistory = yield this.encryptHistory();
            return yield this.storageService.save(Keys.history, newHistory);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.history = [];
            return yield this.storageService.remove(Keys.history);
        });
    }
    encryptHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.history == null || this.history.length === 0) {
                return Promise.resolve([]);
            }
            const promises = this.history.map((item) => __awaiter(this, void 0, void 0, function* () {
                const encrypted = yield this.cryptoService.encrypt(item.password);
                return new PasswordHistory(encrypted.encryptedString, item.date);
            }));
            return yield Promise.all(promises);
        });
    }
    decryptHistory(history) {
        return __awaiter(this, void 0, void 0, function* () {
            if (history == null || history.length === 0) {
                return Promise.resolve([]);
            }
            const promises = history.map((item) => __awaiter(this, void 0, void 0, function* () {
                const decrypted = yield this.cryptoService.decrypt(new CipherString(item.password));
                return new PasswordHistory(decrypted, item.date);
            }));
            return yield Promise.all(promises);
        });
    }
    matchesPrevious(password) {
        if (this.history == null || this.history.length === 0) {
            return false;
        }
        return this.history[this.history.length - 1].password === password;
    }
}
//# sourceMappingURL=passwordGeneration.service.js.map