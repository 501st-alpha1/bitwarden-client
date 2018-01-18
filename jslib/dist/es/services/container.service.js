export class ContainerService {
    constructor(cryptoService, platformUtilsService) {
        this.cryptoService = cryptoService;
        this.platformUtilsService = platformUtilsService;
    }
    attachToWindow(win) {
        if (!win.bitwardenContainerService) {
            win.bitwardenContainerService = this;
        }
    }
    getCryptoService() {
        return this.cryptoService;
    }
    getPlatformUtilsService() {
        return this.platformUtilsService;
    }
}
//# sourceMappingURL=container.service.js.map