export declare class ConstantsService {
    static readonly environmentUrlsKey: string;
    static readonly disableGaKey: string;
    static readonly disableAddLoginNotificationKey: string;
    static readonly disableContextMenuItemKey: string;
    static readonly disableFaviconKey: string;
    static readonly disableAutoTotpCopyKey: string;
    static readonly enableAutoFillOnPageLoadKey: string;
    static readonly lockOptionKey: string;
    static readonly lastActiveKey: string;
    readonly environmentUrlsKey: string;
    readonly disableGaKey: string;
    readonly disableAddLoginNotificationKey: string;
    readonly disableContextMenuItemKey: string;
    readonly disableFaviconKey: string;
    readonly disableAutoTotpCopyKey: string;
    readonly enableAutoFillOnPageLoadKey: string;
    readonly lockOptionKey: string;
    readonly lastActiveKey: string;
    readonly encType: any;
    readonly cipherType: any;
    readonly fieldType: any;
    readonly twoFactorProvider: any;
    twoFactorProviderInfo: any[];
    constructor(i18nService: any, delayLoad: number);
    private bootstrap(i18nService);
}
