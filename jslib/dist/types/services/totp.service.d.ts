import { StorageService } from '../abstractions/storage.service';
import { TotpService as TotpServiceInterface } from '../abstractions/totp.service';
export declare class TotpService implements TotpServiceInterface {
    private storageService;
    constructor(storageService: StorageService);
    getCode(keyb32: string): Promise<string>;
    isAutoCopyEnabled(): Promise<boolean>;
    private leftpad(s, l, p);
    private dec2hex(d);
    private hex2dec(s);
    private hex2bytes(s);
    private buff2hex(buff);
    private b32tohex(s);
    private b32tobytes(s);
    private sign(keyBytes, timeBytes);
}
