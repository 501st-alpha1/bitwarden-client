import { FolderData } from '../models/data/folderData';
import { Folder } from '../models/domain/folder';
export interface FolderService {
    decryptedFolderCache: any[];
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
