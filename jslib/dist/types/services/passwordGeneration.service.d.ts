import { PasswordHistory } from '../models/domain/passwordHistory';
import { CryptoService } from '../abstractions/crypto.service';
import { PasswordGenerationService as PasswordGenerationServiceInterface } from '../abstractions/passwordGeneration.service';
import { StorageService } from '../abstractions/storage.service';
export declare class PasswordGenerationService implements PasswordGenerationServiceInterface {
    private cryptoService;
    private storageService;
    static generatePassword(options: any): string;
    optionsCache: any;
    history: PasswordHistory[];
    constructor(cryptoService: CryptoService, storageService: StorageService);
    generatePassword(options: any): string;
    getOptions(): Promise<any>;
    saveOptions(options: any): Promise<void>;
    getHistory(): PasswordHistory[];
    addHistory(password: string): Promise<any>;
    clear(): Promise<any>;
    private encryptHistory();
    private decryptHistory(history);
    private matchesPrevious(password);
}
