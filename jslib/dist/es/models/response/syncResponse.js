import { CipherResponse } from './cipherResponse';
import { CollectionResponse } from './collectionResponse';
import { DomainsResponse } from './domainsResponse';
import { FolderResponse } from './folderResponse';
import { ProfileResponse } from './profileResponse';
class SyncResponse {
    constructor(response) {
        this.folders = [];
        this.collections = [];
        this.ciphers = [];
        if (response.Profile) {
            this.profile = new ProfileResponse(response.Profile);
        }
        if (response.Folders) {
            response.Folders.forEach((folder) => {
                this.folders.push(new FolderResponse(folder));
            });
        }
        if (response.Collections) {
            response.Collections.forEach((collection) => {
                this.collections.push(new CollectionResponse(collection));
            });
        }
        if (response.Ciphers) {
            response.Ciphers.forEach((cipher) => {
                this.ciphers.push(new CipherResponse(cipher));
            });
        }
        if (response.Domains) {
            this.domains = new DomainsResponse(response.Domains);
        }
    }
}
export { SyncResponse };
window.SyncResponse = SyncResponse;
//# sourceMappingURL=syncResponse.js.map