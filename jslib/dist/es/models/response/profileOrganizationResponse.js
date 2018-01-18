class ProfileOrganizationResponse {
    constructor(response) {
        this.id = response.Id;
        this.name = response.Name;
        this.useGroups = response.UseGroups;
        this.useDirectory = response.UseDirectory;
        this.useTotp = response.UseTotp;
        this.seats = response.Seats;
        this.maxCollections = response.MaxCollections;
        this.maxStorageGb = response.MaxStorageGb;
        this.key = response.Key;
        this.status = response.Status;
        this.type = response.Type;
    }
}
export { ProfileOrganizationResponse };
window.ProfileOrganizationResponse = ProfileOrganizationResponse;
//# sourceMappingURL=profileOrganizationResponse.js.map