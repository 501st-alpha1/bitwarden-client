import { DeviceRequest } from './deviceRequest';
declare class TokenRequest {
    email: string;
    masterPasswordHash: string;
    token: string;
    provider: number;
    remember: boolean;
    device?: DeviceRequest;
    constructor(email: string, masterPasswordHash: string, provider: number, token: string, remember: boolean, device?: DeviceRequest);
    toIdentityToken(): any;
}
export { TokenRequest };
