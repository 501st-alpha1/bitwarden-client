import { CollectionData } from '../models/data/collectionData';
import { Collection } from '../models/domain/collection';
import { CollectionService as CollectionServiceInterface } from '../abstractions/collection.service';
import { CryptoService } from '../abstractions/crypto.service';
import { StorageService } from '../abstractions/storage.service';
import { UserService } from '../abstractions/user.service';
export declare class CollectionService implements CollectionServiceInterface {
    private cryptoService;
    private userService;
    private storageService;
    decryptedCollectionCache: any[];
    constructor(cryptoService: CryptoService, userService: UserService, storageService: StorageService);
    clearCache(): void;
    get(id: string): Promise<Collection>;
    getAll(): Promise<Collection[]>;
    getAllDecrypted(): Promise<any[]>;
    upsert(collection: CollectionData | CollectionData[]): Promise<any>;
    replace(collections: {
        [id: string]: CollectionData;
    }): Promise<any>;
    clear(userId: string): Promise<any>;
    delete(id: string | string[]): Promise<any>;
}
