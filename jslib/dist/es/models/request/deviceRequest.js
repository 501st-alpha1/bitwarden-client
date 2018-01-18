class DeviceRequest {
    constructor(appId, platformUtilsService) {
        this.type = platformUtilsService.getDevice();
        this.name = platformUtilsService.getDeviceString();
        this.identifier = appId;
        this.pushToken = null;
    }
}
export { DeviceRequest };
window.DeviceRequest = DeviceRequest;
//# sourceMappingURL=deviceRequest.js.map