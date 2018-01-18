import { AppIdService as AppIdServiceInterface } from '../abstractions/appId.service';
import { StorageService } from '../abstractions/storage.service';
export declare class AppIdService implements AppIdServiceInterface {
    private storageService;
    constructor(storageService: StorageService);
    getAppId(): Promise<string>;
    getAnonymousAppId(): Promise<string>;
    private makeAndGetAppId(key);
}
