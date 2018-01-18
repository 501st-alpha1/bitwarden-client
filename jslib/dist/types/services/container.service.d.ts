import { CryptoService } from '../abstractions/crypto.service';
import { PlatformUtilsService } from '../abstractions/platformUtils.service';
export declare class ContainerService {
    private cryptoService;
    private platformUtilsService;
    constructor(cryptoService: CryptoService, platformUtilsService: PlatformUtilsService);
    attachToWindow(win: any): void;
    getCryptoService(): CryptoService;
    getPlatformUtilsService(): PlatformUtilsService;
}
