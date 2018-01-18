import { StorageService } from '../abstractions/storage.service';
import { TokenService } from '../abstractions/token.service';
import { UserService as UserServiceInterface } from '../abstractions/user.service';
export declare class UserService implements UserServiceInterface {
    private tokenService;
    private storageService;
    userId: string;
    email: string;
    stamp: string;
    constructor(tokenService: TokenService, storageService: StorageService);
    setUserIdAndEmail(userId: string, email: string): Promise<any>;
    setSecurityStamp(stamp: string): Promise<any>;
    getUserId(): Promise<string>;
    getEmail(): Promise<string>;
    getSecurityStamp(): Promise<string>;
    clear(): Promise<any>;
    isAuthenticated(): Promise<boolean>;
}
