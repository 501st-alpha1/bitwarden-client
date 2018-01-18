class IdentityData {
    constructor(data) {
        this.title = data.Title;
        this.firstName = data.FirstName;
        this.middleName = data.MiddleName;
        this.lastName = data.LastName;
        this.address1 = data.Address1;
        this.address2 = data.Address2;
        this.address3 = data.Address3;
        this.city = data.City;
        this.state = data.State;
        this.postalCode = data.PostalCode;
        this.country = data.Country;
        this.company = data.Company;
        this.email = data.Email;
        this.phone = data.Phone;
        this.ssn = data.SSN;
        this.username = data.Username;
        this.passportNumber = data.PassportNumber;
        this.licenseNumber = data.LicenseNumber;
    }
}
export { IdentityData };
window.IdentityData = IdentityData;
//# sourceMappingURL=identityData.js.map