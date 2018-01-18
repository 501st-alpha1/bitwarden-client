import { CipherService } from '../abstractions/cipher.service';
import { CollectionService } from '../abstractions/collection.service';
import { CryptoService } from '../abstractions/crypto.service';
import { FolderService } from '../abstractions/folder.service';
import { LockService as LockServiceInterface } from '../abstractions/lock.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
import { StorageService } from '../abstractions/storage.service';
export declare class LockService implements LockServiceInterface {
    private cipherService;
    private folderService;
    private collectionService;
    private cryptoService;
    private platformUtilsService;
    private storageService;
    private setIcon;
    private refreshBadgeAndMenu;
    constructor(cipherService: CipherService, folderService: FolderService, collectionService: CollectionService, cryptoService: CryptoService, platformUtilsService: PlatformUtilsService, storageService: StorageService, setIcon: Function, refreshBadgeAndMenu: Function);
    checkLock(): Promise<void>;
    lock(): Promise<void>;
}
