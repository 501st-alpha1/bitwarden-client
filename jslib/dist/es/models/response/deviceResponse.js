class DeviceResponse {
    constructor(response) {
        this.id = response.Id;
        this.name = response.Name;
        this.identifier = response.Identifier;
        this.type = response.Type;
        this.creationDate = response.CreationDate;
    }
}
export { DeviceResponse };
window.DeviceResponse = DeviceResponse;
//# sourceMappingURL=deviceResponse.js.map