import { ApiService } from '../abstractions/api.service';
import { EnvironmentService as EnvironmentServiceInterface } from '../abstractions/environment.service';
import { StorageService } from '../abstractions/storage.service';
export declare class EnvironmentService implements EnvironmentServiceInterface {
    private apiService;
    private storageService;
    baseUrl: string;
    webVaultUrl: string;
    apiUrl: string;
    identityUrl: string;
    iconsUrl: string;
    constructor(apiService: ApiService, storageService: StorageService);
    setUrlsFromStorage(): Promise<void>;
    setUrls(urls: any): Promise<any>;
    private formatUrl(url);
}
