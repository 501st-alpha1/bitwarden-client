export class ConstantsService {
    constructor(i18nService, delayLoad) {
        this.environmentUrlsKey = ConstantsService.environmentUrlsKey;
        this.disableGaKey = ConstantsService.disableGaKey;
        this.disableAddLoginNotificationKey = ConstantsService.disableAddLoginNotificationKey;
        this.disableContextMenuItemKey = ConstantsService.disableContextMenuItemKey;
        this.disableFaviconKey = ConstantsService.disableFaviconKey;
        this.disableAutoTotpCopyKey = ConstantsService.disableAutoTotpCopyKey;
        this.enableAutoFillOnPageLoadKey = ConstantsService.enableAutoFillOnPageLoadKey;
        this.lockOptionKey = ConstantsService.lockOptionKey;
        this.lastActiveKey = ConstantsService.lastActiveKey;
        // TODO: Convert these objects to enums
        this.encType = {
            AesCbc256_B64: 0,
            AesCbc128_HmacSha256_B64: 1,
            AesCbc256_HmacSha256_B64: 2,
            Rsa2048_OaepSha256_B64: 3,
            Rsa2048_OaepSha1_B64: 4,
            Rsa2048_OaepSha256_HmacSha256_B64: 5,
            Rsa2048_OaepSha1_HmacSha256_B64: 6,
        };
        this.cipherType = {
            login: 1,
            secureNote: 2,
            card: 3,
            identity: 4,
        };
        this.fieldType = {
            text: 0,
            hidden: 1,
            boolean: 2,
        };
        this.twoFactorProvider = {
            u2f: 4,
            yubikey: 3,
            duo: 2,
            authenticator: 0,
            email: 1,
            remember: 5,
        };
        if (delayLoad && delayLoad > 0) {
            // delay for i18n fetch
            setTimeout(() => {
                this.bootstrap(i18nService);
            }, delayLoad);
        }
        else {
            this.bootstrap(i18nService);
        }
    }
    bootstrap(i18nService) {
        this.twoFactorProviderInfo = [
            {
                type: 0,
                name: i18nService.authenticatorAppTitle,
                description: i18nService.authenticatorAppDesc,
                active: true,
                free: true,
                displayOrder: 0,
                priority: 1,
            },
            {
                type: 3,
                name: i18nService.yubiKeyTitle,
                description: i18nService.yubiKeyDesc,
                active: true,
                displayOrder: 1,
                priority: 3,
            },
            {
                type: 2,
                name: 'Duo',
                description: i18nService.duoDesc,
                active: true,
                displayOrder: 2,
                priority: 2,
            },
            {
                type: 4,
                name: i18nService.u2fTitle,
                description: i18nService.u2fDesc,
                active: true,
                displayOrder: 3,
                priority: 4,
            },
            {
                type: 1,
                name: i18nService.emailTitle,
                description: i18nService.emailDesc,
                active: true,
                displayOrder: 4,
                priority: 0,
            },
        ];
    }
}
ConstantsService.environmentUrlsKey = 'environmentUrls';
ConstantsService.disableGaKey = 'disableGa';
ConstantsService.disableAddLoginNotificationKey = 'disableAddLoginNotification';
ConstantsService.disableContextMenuItemKey = 'disableContextMenuItem';
ConstantsService.disableFaviconKey = 'disableFavicon';
ConstantsService.disableAutoTotpCopyKey = 'disableAutoTotpCopy';
ConstantsService.enableAutoFillOnPageLoadKey = 'enableAutoFillOnPageLoad';
ConstantsService.lockOptionKey = 'lockOption';
ConstantsService.lastActiveKey = 'lastActive';
//# sourceMappingURL=constants.service.js.map