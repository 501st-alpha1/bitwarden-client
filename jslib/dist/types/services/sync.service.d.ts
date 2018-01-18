import { ApiService } from '../abstractions/api.service';
import { CipherService } from '../abstractions/cipher.service';
import { CollectionService } from '../abstractions/collection.service';
import { CryptoService } from '../abstractions/crypto.service';
import { FolderService } from '../abstractions/folder.service';
import { MessagingService } from '../abstractions/messaging.service';
import { SettingsService } from '../abstractions/settings.service';
import { StorageService } from '../abstractions/storage.service';
import { SyncService as SyncServiceInterface } from '../abstractions/sync.service';
import { UserService } from '../abstractions/user.service';
export declare class SyncService implements SyncServiceInterface {
    private userService;
    private apiService;
    private settingsService;
    private folderService;
    private cipherService;
    private cryptoService;
    private collectionService;
    private storageService;
    private messagingService;
    private logoutCallback;
    syncInProgress: boolean;
    constructor(userService: UserService, apiService: ApiService, settingsService: SettingsService, folderService: FolderService, cipherService: CipherService, cryptoService: CryptoService, collectionService: CollectionService, storageService: StorageService, messagingService: MessagingService, logoutCallback: Function);
    getLastSync(): Promise<Date>;
    setLastSync(date: Date): Promise<any>;
    syncStarted(): void;
    syncCompleted(successfully: boolean): void;
    fullSync(forceSync: boolean): Promise<boolean>;
    private needsSyncing(forceSync);
    private syncProfile(response);
    private syncFolders(userId, response);
    private syncCollections(response);
    private syncCiphers(userId, response);
    private syncSettings(userId, response);
}
