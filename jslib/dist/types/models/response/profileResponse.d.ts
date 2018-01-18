import { ProfileOrganizationResponse } from './profileOrganizationResponse';
declare class ProfileResponse {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    masterPasswordHint: string;
    premium: boolean;
    culture: string;
    twoFactorEnabled: boolean;
    key: string;
    privateKey: string;
    securityStamp: string;
    organizations: ProfileOrganizationResponse[];
    constructor(response: any);
}
export { ProfileResponse };
