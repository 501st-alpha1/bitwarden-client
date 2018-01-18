class FolderRequest {
    constructor(folder) {
        this.name = folder.name ? folder.name.encryptedString : null;
    }
}
export { FolderRequest };
window.FolderRequest = FolderRequest;
//# sourceMappingURL=folderRequest.js.map