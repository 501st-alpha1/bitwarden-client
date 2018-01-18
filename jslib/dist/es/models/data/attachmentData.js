class AttachmentData {
    constructor(response) {
        this.id = response.id;
        this.url = response.url;
        this.fileName = response.fileName;
        this.size = response.size;
        this.sizeName = response.sizeName;
    }
}
export { AttachmentData };
window.AttachmentData = AttachmentData;
//# sourceMappingURL=attachmentData.js.map