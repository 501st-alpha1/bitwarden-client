import { ProfileOrganizationResponse } from './profileOrganizationResponse';
class ProfileResponse {
    constructor(response) {
        this.organizations = [];
        this.id = response.Id;
        this.name = response.Name;
        this.email = response.Email;
        this.emailVerified = response.EmailVerified;
        this.masterPasswordHint = response.MasterPasswordHint;
        this.premium = response.Premium;
        this.culture = response.Culture;
        this.twoFactorEnabled = response.TwoFactorEnabled;
        this.key = response.Key;
        this.privateKey = response.PrivateKey;
        this.securityStamp = response.SecurityStamp;
        if (response.Organizations) {
            response.Organizations.forEach((org) => {
                this.organizations.push(new ProfileOrganizationResponse(org));
            });
        }
    }
}
export { ProfileResponse };
window.ProfileResponse = ProfileResponse;
//# sourceMappingURL=profileResponse.js.map