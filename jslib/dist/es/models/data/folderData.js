class FolderData {
    constructor(response, userId) {
        this.userId = userId;
        this.name = response.name;
        this.id = response.id;
        this.revisionDate = response.revisionDate;
    }
}
export { FolderData };
window.FolderData = FolderData;
//# sourceMappingURL=folderData.js.map