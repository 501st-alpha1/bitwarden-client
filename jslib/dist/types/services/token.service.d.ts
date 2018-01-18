import { StorageService } from '../abstractions/storage.service';
import { TokenService as TokenServiceInterface } from '../abstractions/token.service';
export declare class TokenService implements TokenServiceInterface {
    private storageService;
    token: string;
    decodedToken: any;
    refreshToken: string;
    constructor(storageService: StorageService);
    setTokens(accessToken: string, refreshToken: string): Promise<any>;
    setToken(token: string): Promise<any>;
    getToken(): Promise<string>;
    setRefreshToken(refreshToken: string): Promise<any>;
    getRefreshToken(): Promise<string>;
    setTwoFactorToken(token: string, email: string): Promise<any>;
    getTwoFactorToken(email: string): Promise<string>;
    clearTwoFactorToken(email: string): Promise<any>;
    clearToken(): Promise<any>;
    decodeToken(): any;
    getTokenExpirationDate(): Date;
    tokenSecondsRemaining(offsetSeconds?: number): number;
    tokenNeedsRefresh(minutes?: number): boolean;
    getUserId(): string;
    getEmail(): string;
    getName(): string;
    getPremium(): boolean;
    getIssuer(): string;
}
