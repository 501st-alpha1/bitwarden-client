import { FolderData } from '../models/data/folderData';
import { Folder } from '../models/domain/folder';
import { ApiService } from '../abstractions/api.service';
import { CryptoService } from '../abstractions/crypto.service';
import { FolderService as FolderServiceInterface } from '../abstractions/folder.service';
import { StorageService } from '../abstractions/storage.service';
import { UserService } from '../abstractions/user.service';
export declare class FolderService implements FolderServiceInterface {
    private cryptoService;
    private userService;
    private noneFolder;
    private apiService;
    private storageService;
    decryptedFolderCache: any[];
    constructor(cryptoService: CryptoService, userService: UserService, noneFolder: () => string, apiService: ApiService, storageService: StorageService);
    clearCache(): void;
    encrypt(model: any): Promise<Folder>;
    get(id: string): Promise<Folder>;
    getAll(): Promise<Folder[]>;
    getAllDecrypted(): Promise<any[]>;
    saveWithServer(folder: Folder): Promise<any>;
    upsert(folder: FolderData | FolderData[]): Promise<any>;
    replace(folders: {
        [id: string]: FolderData;
    }): Promise<any>;
    clear(userId: string): Promise<any>;
    delete(id: string | string[]): Promise<any>;
    deleteWithServer(id: string): Promise<any>;
}
