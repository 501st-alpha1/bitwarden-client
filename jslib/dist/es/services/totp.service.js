var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ConstantsService } from './constants.service';
const b32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TotpAlgorithm = {
    name: 'HMAC',
    hash: { name: 'SHA-1' },
};
export class TotpService {
    constructor(storageService) {
        this.storageService = storageService;
    }
    getCode(keyb32) {
        return __awaiter(this, void 0, void 0, function* () {
            const epoch = Math.round(new Date().getTime() / 1000.0);
            const timeHex = this.leftpad(this.dec2hex(Math.floor(epoch / 30)), 16, '0');
            const timeBytes = this.hex2bytes(timeHex);
            const keyBytes = this.b32tobytes(keyb32);
            if (!keyBytes.length || !timeBytes.length) {
                return null;
            }
            const hashHex = yield this.sign(keyBytes, timeBytes);
            if (!hashHex) {
                return null;
            }
            const offset = this.hex2dec(hashHex.substring(hashHex.length - 1));
            // tslint:disable-next-line
            let otp = (this.hex2dec(hashHex.substr(offset * 2, 8)) & this.hex2dec('7fffffff')) + '';
            otp = (otp).substr(otp.length - 6, 6);
            return otp;
        });
    }
    isAutoCopyEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield this.storageService.get(ConstantsService.disableAutoTotpCopyKey));
        });
    }
    // Helpers
    leftpad(s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    }
    dec2hex(d) {
        return (d < 15.5 ? '0' : '') + Math.round(d).toString(16);
    }
    hex2dec(s) {
        return parseInt(s, 16);
    }
    hex2bytes(s) {
        const bytes = new Uint8Array(s.length / 2);
        for (let i = 0; i < s.length; i += 2) {
            bytes[i / 2] = parseInt(s.substr(i, 2), 16);
        }
        return bytes;
    }
    buff2hex(buff) {
        const bytes = new Uint8Array(buff);
        const hex = [];
        bytes.forEach((b) => {
            // tslint:disable-next-line
            hex.push((b >>> 4).toString(16));
            // tslint:disable-next-line
            hex.push((b & 0xF).toString(16));
        });
        return hex.join('');
    }
    b32tohex(s) {
        s = s.toUpperCase();
        let cleanedInput = '';
        for (let i = 0; i < s.length; i++) {
            if (b32Chars.indexOf(s[i]) < 0) {
                continue;
            }
            cleanedInput += s[i];
        }
        s = cleanedInput;
        let bits = '';
        let hex = '';
        for (let i = 0; i < s.length; i++) {
            const byteIndex = b32Chars.indexOf(s.charAt(i));
            if (byteIndex < 0) {
                continue;
            }
            bits += this.leftpad(byteIndex.toString(2), 5, '0');
        }
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            const chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    }
    b32tobytes(s) {
        return this.hex2bytes(this.b32tohex(s));
    }
    sign(keyBytes, timeBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield window.crypto.subtle.importKey('raw', keyBytes, TotpAlgorithm, false, ['sign']);
            const signature = yield window.crypto.subtle.sign(TotpAlgorithm, key, timeBytes);
            return this.buff2hex(signature);
        });
    }
}
//# sourceMappingURL=totp.service.js.map